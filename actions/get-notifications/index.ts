"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";

const GetNotificationsSchema = z.object({});

type InputType = z.infer<typeof GetNotificationsSchema>;
type ReturnType = {
  data?: { notifications: any[] };
  error?: string;
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const notifications = await db.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return {
      data: { notifications },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Failed to fetch notifications" };
  }
};

export const getNotifications = createSafeAction(GetNotificationsSchema, handler);