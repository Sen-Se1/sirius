"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetUnreadCountsPerSender } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const unreadMessages = await db.chatMessage.groupBy({
      by: ["senderId"],
      where: {
        recipientId: userId,
        isRead: false,
      },
      _count: {
        id: true,
      },
    });

    const unreadCounts: Record<string, number> = {};
    for (const msg of unreadMessages) {
      unreadCounts[msg.senderId] = msg._count.id;
    }

    return { data: unreadCounts };
  } catch (error) {
    console.error("Error fetching unread counts per sender:", error);
    return { error: "Failed to fetch unread counts per sender" };
  }
};

export const getUnreadCountsPerSender = createSafeAction(GetUnreadCountsPerSender, handler);