"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetAllUsers } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Find all users who have sent messages to the current user
    const senders = await db.chatMessage.findMany({
      where: {
        recipientId: userId,
      },
      select: {
        sender: true,
      },
      distinct: ["senderId"],
    });

    // Find all users who have received messages from the current user
    const recipients = await db.chatMessage.findMany({
      where: {
        senderId: userId,
      },
      select: {
        recipient: true,
      },
      distinct: ["recipientId"],
    });

    // Combine sender and recipient IDs into a unique set
    const userIds = new Set<string>();
    senders.forEach((msg) => userIds.add(msg.sender.id));
    recipients.forEach((msg) => userIds.add(msg.recipient.id));

    // Fetch user details for the identified user IDs
    const users = await db.user.findMany({
      where: {
        id: {
          in: Array.from(userIds),
        },
      },
    });

    return { data: users };
  } catch (error) {
    return {
      error: "Failed to fetch users.",
    };
  }
};

export const getAllUsers = createSafeAction(GetAllUsers, handler);