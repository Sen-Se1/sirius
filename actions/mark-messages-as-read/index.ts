"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { MarkMessagesAsRead } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { senderId } = data;

  try {
    const updatedMessages = await db.chatMessage.findMany({
      where: {
        senderId,
        recipientId: userId,
        isRead: false,
      },
      select: {
        id: true,
      },
    });

    const messageIds = updatedMessages.map((msg) => msg.id);

    await db.chatMessage.updateMany({
      where: {
        senderId,
        recipientId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    const newUnreadCount = await db.chatMessage.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });

    if (messageIds.length > 0) {
      await pusherServer.trigger(`user-${senderId}`, "message-read", {
        messageIds,
        senderId: userId,
      });
    }

    return { data: { success: true, newUnreadCount } };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
};

export const markMessagesAsRead = createSafeAction(MarkMessagesAsRead, handler);
