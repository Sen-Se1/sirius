"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { MarkNotificationRead } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { notificationId } = data;

  try {
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return { error: "Notification not found" };
    }

    if (notification.userId !== userId) {
      return { error: "Unauthorized" };
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return { data: { success: true } };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to mark notification as read" };
  }
};

export const markNotificationRead = createSafeAction(MarkNotificationRead, handler);