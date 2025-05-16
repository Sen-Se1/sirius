"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteChecklist } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let checklist;

  try {
    checklist = await db.checklist.delete({
      where: {
        id,
        card: {
          list: {
            board: {
              orgId,
              id: boardId,
            },
          },
        },
      },
    });

    await createAuditLog({
      entityTitle: checklist.title,
      entityId: checklist.id,
      entityType: ENTITY_TYPE.CHECKLIST,
      action: ACTION.DELETE,
    });

    revalidatePath(`/board/${boardId}`);
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: checklist };
};

export const deleteChecklist = createSafeAction(DeleteChecklist, handler);