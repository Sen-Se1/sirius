"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { EditMessage } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { messageId, content } = data;

  try {
    // Fetch the message to verify ownership
    const message = await db.chatMessage.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        recipientId: true,
        content: true,
        filePath: true,
        originalFileName: true,
        fileType: true,
        createdAt: true,
        isRead: true,
      },
    });

    if (!message) {
      return { error: "Message not found" };
    }

    if (message.senderId !== userId) {
      return { error: "You can only edit your own messages" };
    }

    // Update only the content field (file fields remain unchanged)
    const updatedMessage = await db.chatMessage.update({
      where: { id: messageId },
      data: { content },
      select: {
        id: true,
        senderId: true,
        content: true,
        filePath: true,
        originalFileName: true,
        fileType: true,
        createdAt: true,
        isRead: true,
      },
    });

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(
      `user-${message.senderId}`,
      "message-edited",
      updatedMessage
    );
    await pusherServer.trigger(
      `user-${message.recipientId}`,
      "message-edited",
      updatedMessage
    );

    return { data: { message: updatedMessage } };
  } catch (error) {
    console.error("Error editing message:", error);
    return { error: "Failed to edit message" };
  }
};

export const editMessage = createSafeAction(EditMessage, handler);
