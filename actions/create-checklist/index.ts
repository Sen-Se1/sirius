"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateChecklist } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { cardId, title } = data;

  let checklist;

  try {
    const card = await db.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!card) {
      return {
        error: "Card not found",
      };
    }

    checklist = await db.checklist.create({
      data: {
        title,
        cardId,
      },
    });

    await createAuditLog({
      entityTitle: checklist.title,
      entityId: checklist.id,
      entityType: ENTITY_TYPE.CHECKLIST,
      action: ACTION.CREATE,
    });

    revalidatePath(`/board/${card.list.board.id}`);
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  return { data: checklist };
};

export const createChecklist = createSafeAction(CreateChecklist, handler);