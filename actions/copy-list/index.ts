"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";
import { ListWithCards } from "@/types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list: ListWithCards;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: {
          include: {
            checklists: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
              dueDate: card.dueDate,
              priority: card.priority,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });

    const cardMap = new Map<string, string>();
    listToCopy.cards.forEach((originalCard, index) => {
      cardMap.set(originalCard.id, list.cards[index].id);
    });

    for (const originalCard of listToCopy.cards) {
      const newCardId = cardMap.get(originalCard.id);
      if (!newCardId) continue;

      for (const checklist of originalCard.checklists) {
        const newChecklist = await db.checklist.create({
          data: {
            title: checklist.title,
            cardId: newCardId,
            items: {
              create: checklist.items.map((item) => ({
                title: item.title,
                checked: item.checked,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        // Create audit log for the new checklist
        // await createAuditLog({
        //   entityTitle: newChecklist.title,
        //   entityId: newChecklist.id,
        //   entityType: ENTITY_TYPE.CHECKLIST,
        //   action: ACTION.CREATE,
        // });

        // Create audit logs for the new checklist items
        // for (const item of newChecklist.items) {
        //   await createAuditLog({
        //     entityTitle: item.title,
        //     entityId: item.id,
        //     entityType: ENTITY_TYPE.CHECKLIST_ITEM,
        //     action: ACTION.CREATE,
        //   });
        // }
      }

      // Create audit log for the new card
      // const newCard = list.cards.find((card) => card.id === newCardId);
      // if (newCard) {
      //   await createAuditLog({
      //     entityTitle: newCard.title,
      //     entityId: newCard.id,
      //     entityType: ENTITY_TYPE.CARD,
      //     action: ACTION.CREATE,
      //   });
      // }
    }

    // Create audit log for the new list
    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);