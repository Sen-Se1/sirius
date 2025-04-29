"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CheckCardDeadlines } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const overdueCards = await db.card.findMany({
      where: {
        dueDate: {
          lte: new Date(),
        },
        notifications: {
          none: {},
        },
      },
      include: {
        list: {
          include: {
            board: {
              include: { organization: true },
            },
          },
        },
      },
    });

    let notificationsCreated = 0;

    for (const card of overdueCards) {
      const members = await db.member.findMany({
        where: { orgId: card.list.board.orgId },
      });

      for (const member of members) {
        const notification = await db.notification.create({
          data: {
            userId: member.userId,
            orgId: card.list.board.orgId,
            message: `You have a deadline in card "${card.title}"`,
            isRead: false,
            cardId: card.id,
          },
        });
        notificationsCreated++;

        await pusherServer.trigger(
          `notifications-${member.userId}`,
          "new-notification",
          notification
        );
      }
    }

    return {
      data: {
        notificationsCreated,
      },
    };
  } catch (error) {
    console.error("Error checking card deadlines:", error);
    return { error: "Failed to check card deadlines" };
  }
};

export const checkCardDeadlines = createSafeAction(CheckCardDeadlines, handler);