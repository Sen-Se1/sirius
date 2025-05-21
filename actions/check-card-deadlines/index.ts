"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CheckCardDeadlines } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayAfterTomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

    // Fetch cards that are overdue, due today, or due tomorrow
    const cards = await db.card.findMany({
      where: {
        dueDate: {
          lt: dayAfterTomorrowStart, // Include cards up to tomorrow
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
        notifications: {
          where: {
            createdAt: {
              gte: todayStart, // Notifications created today
            },
          },
        },
      },
    });

    let notificationsCreated = 0;

    for (const card of cards) {
      const dueDate = new Date(card.dueDate!);      
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const hasRecentNotification = card.notifications.some(
        (notification) => notification.createdAt >= card.updatedAt
      );

      if (hasRecentNotification) {
        continue;
      }

      let message = "";

      if (dueDateOnly < todayDateOnly) {
        message = `Overdue: Card "${card.title}" in list "${card.list.title}" on board "${card.list.board.title}" has passed its deadline.`;
      } else if (dueDateOnly.getTime() === todayDateOnly.getTime()) {
        message = `Due Today: Card "${card.title}" in list "${card.list.title}" on board "${card.list.board.title}" is due today.`;
      } else if (dueDateOnly.getTime() === tomorrowDateOnly.getTime()) {
        message = `Due Tomorrow: Card "${card.title}" in list "${card.list.title}" on board "${card.list.board.title}" is due tomorrow.`;
      } else {
        continue;
      }

      const members = await db.member.findMany({
        where: { orgId: card.list.board.orgId },
      });

      for (const member of members) {
        const notification = await db.notification.create({
          data: {
            userId: member.userId,
            orgId: card.list.board.orgId,
            message,
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