"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteMessage } from "./schema";
import { InputType, ReturnType } from "./types";
import { pusherServer } from "@/lib/pusher";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { messageId } = data;

  try {
    // Fetch the message to verify ownership
    const message = await db.chatMessage.findUnique({
      where: { id: messageId },
      select: { senderId: true, recipientId: true },
    });

    if (!message) {
      return { error: "Message not found" };
    }

    if (message.senderId !== userId) {
      return { error: "You can only delete your own messages" };
    }

    // Delete the message
    await db.chatMessage.delete({
      where: { id: messageId },
    });

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(`user-${message.senderId}`, "message-deleted", {
      messageId,
    });
    await pusherServer.trigger(
      `user-${message.recipientId}`,
      "message-deleted",
      { messageId }
    );

    return { data: { messageId } };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { error: "Failed to delete message" };
  }
};

export const deleteMessage = createSafeAction(DeleteMessage, handler);
