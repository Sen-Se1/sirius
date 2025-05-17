"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ChecklistItem, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateChecklistItem } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { checklistId, title } = data;

  let item: ChecklistItem;

  try {
    const checklist = await db.checklist.findUnique({
      where: {
        id: checklistId,
        card: {
          list: {
            board: {
              orgId,
            },
          },
        },
      },
      select: {
        id: true,
        card: {
          select: {
            list: {
              select: {
                board: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!checklist) {
      return {
        error: "Checklist not found",
      };
    }

    const maxOrder = await db.checklistItem.aggregate({
      where: {
        checklistId,
      },
      _max: {
        order: true,
      },
    });

    const newOrder = (maxOrder._max.order ?? 0) + 1;

    item = await db.checklistItem.create({
      data: {
        title,
        checklistId,
        order: newOrder,
      },
    });

    await createAuditLog({
      entityTitle: item.title,
      entityId: item.id,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      action: ACTION.CREATE,
    });

    revalidatePath(`/board/${checklist.card.list.board.id}`);
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  return { data: item };
};

export const createChecklistItem = createSafeAction(CreateChecklistItem, handler);