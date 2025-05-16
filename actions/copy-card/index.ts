"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        checklists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!cardToCopy) {
      return { error: "Card not found" };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        dueDate: cardToCopy.dueDate,
        priority: cardToCopy.priority,
        listId: cardToCopy.listId,
        checklists: {
          create: cardToCopy.checklists.map((checklist) => ({
            title: checklist.title,
            items: {
              create: checklist.items.map((item) => ({
                title: item.title,
                checked: item.checked,
              })),
            },
          })),
        },
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });

    // const newChecklists = await db.checklist.findMany({
    //   where: { cardId: card.id },
    //   include: { items: true },
    // });

    // for (const checklist of newChecklists) {
    //   await createAuditLog({
    //     entityTitle: checklist.title,
    //     entityId: checklist.id,
    //     entityType: ENTITY_TYPE.CHECKLIST,
    //     action: ACTION.CREATE,
    //   });

    //   for (const item of checklist.items) {
    //     await createAuditLog({
    //       entityTitle: item.title,
    //       entityId: item.id,
    //       entityType: ENTITY_TYPE.CHECKLIST_ITEM,
    //       action: ACTION.CREATE,
    //     });
    //   }
    // }
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);