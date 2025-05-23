"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { MarkAllNotificationsAsReadSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const unreadNotifications = await db.notification.findMany({
      where: { userId, isRead: false },
      select: { id: true },
    });

    if (unreadNotifications.length === 0) {
      return { data: { success: true } };
    }

    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    for (const notification of unreadNotifications) {
      await pusherServer.trigger(
        `notifications-${userId}`,
        "notification-updated",
        {
          id: notification.id,
          isRead: true,
        }
      );
    }

    return { data: { success: true } };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Failed to mark all notifications as read" };
  }
};

export const markAllNotificationsAsRead = createSafeAction(
  MarkAllNotificationsAsReadSchema,
  handler
);