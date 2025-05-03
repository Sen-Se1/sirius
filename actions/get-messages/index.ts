"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetMessages } from "./schema";
import { GetMessagesInputType, GetMessagesReturnType } from "./types";

const handler = async (
  data: GetMessagesInputType
): Promise<GetMessagesReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { recipientId } = data;

  try {
    const messages = await db.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
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

    return {
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
};

export const getMessages = createSafeAction(GetMessages, handler);