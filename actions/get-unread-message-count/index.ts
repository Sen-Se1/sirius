"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetUnreadMessageCount } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const count = await db.chatMessage.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
    return { data: { count } };
  } catch (error) {
    console.error("Error fetching unread message count:", error);
    return { error: "Failed to fetch unread message count" };
  }
};

export const getUnreadMessageCount = createSafeAction(GetUnreadMessageCount, handler);