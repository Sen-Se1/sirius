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
    const recipient = await db.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      return { error: "Recipient not found" };
    }

    const sender = await db.user.findUnique({
      where: { id: userId },
    });
    if (!sender) {
      return { error: "Sender not found" };
    }

    const message = await db.chatMessage.create({
      data: {
        senderId: userId,
        recipientId,
        content,
        isRead: false,
      },
    });

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