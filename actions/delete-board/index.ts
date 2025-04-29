"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const isPro = await checkSubscription();

  const { id } = data;
  let board;

  try {
    const lists = await db.list.findMany({
      where: {
        boardId: id,
      },
      select: {
        cards: {
          select: {
            id: true,
            notifications: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    const notifications = lists
      .flatMap((list) => list.cards)
      .flatMap((card) => card.notifications);

    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    for (const notification of notifications) {
      await pusherServer.trigger(
        `notifications-${notification.userId}`,
        "notification-deleted",
        { id: notification.id }
      );
    }

    if (!isPro) {
      await decreaseAvailableCount();
    }

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
