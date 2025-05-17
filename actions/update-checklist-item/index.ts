"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ChecklistItem, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateChecklistItem } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, title, checked, boardId } = data;

  let item: ChecklistItem;

  try {
    item = await db.checklistItem.update({
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
      data: {
        title,
        checked,
      },
    });

    await createAuditLog({
      entityTitle: item.title,
      entityId: item.id,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      action: ACTION.UPDATE,
    });

    revalidatePath(`/board/${boardId}`);
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  return { data: item };
};

export const updateChecklistItem = createSafeAction(UpdateChecklistItem, handler);