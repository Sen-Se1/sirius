"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { createSafeAction } from "@/lib/create-safe-action";
import { SendMessage } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { recipientId, content } = data;

  try {
    // Verify recipient
    const recipient = await db.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      return { error: "Recipient not found" };
    }

    // Get sender for notification message
    const sender = await db.user.findUnique({
      where: { id: userId },
    });
    if (!sender) {
      return { error: "Sender not found" };
    }

    // Store message
    const message = await db.chatMessage.create({
      data: {
        senderId: userId,
        recipientId,
        content,
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: recipientId,
        senderId: userId,
        message: `You have a new message from ${sender.firstName}.`,
        isRead: false,
        cardId: null,
      },
    });

    // Trigger Pusher event
    await pusherServer.trigger(`user-${recipientId}`, "new-message", {
      messageId: message.id,
      senderId: userId,
      senderName: sender.firstName,
      content,
      createdAt: message.createdAt,
    });

    return {
      data: { message },
    };
  } catch (error) {
    console.error("Error sending chat message:", error);
    return { error: "Failed to send message" };
  }
};

export const sendMessage = createSafeAction(SendMessage, handler);