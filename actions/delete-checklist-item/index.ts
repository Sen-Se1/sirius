"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteChecklistItem } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let item;

  try {
    item = await db.checklistItem.delete({
      where: {
        id,
        checklist: {
          card: {
            list: {
              board: {
                orgId,
                id: boardId,
              },
            },
          },
        },
      },
    });

    await createAuditLog({
      entityTitle: item.title,
      entityId: item.id,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      action: ACTION.DELETE,
    });

    revalidatePath(`/board/${boardId}`);
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: item };
};

export const deleteChecklistItem = createSafeAction(DeleteChecklistItem, handler);