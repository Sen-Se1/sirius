"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { MarkMessagesAsRead } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { senderId } = data;

  try {
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
    return { data: { success: true } };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
};

export const markMessagesAsRead = createSafeAction(MarkMessagesAsRead, handler);