"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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

  let item;

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
      include: {
        card: {
          include: {
            list: {
              include: {
                board: true,
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

    item = await db.checklistItem.create({
      data: {
        title,
        checklistId,
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