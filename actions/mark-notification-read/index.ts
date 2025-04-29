"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

// Define the input schema for validation
const inputSchema = z.object({
  notificationId: z.string(),
});

/**
 * Marks a notification as read for the authenticated user.
 *
 * @param input - An object containing the notificationId to mark as read.
 * @returns An object with a success flag and a message.
 * @throws Error if the user is unauthorized, the notification is not found, or the user does not own the notification.
 */
export async function markNotificationRead(input: z.infer<typeof inputSchema>) {
  // Validate the input
  const { notificationId } = inputSchema.parse(input);

  // Get the current authenticated user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch the notification from the database
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  // Check if the notification belongs to the current user
  if (notification.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Update the notification's status to read
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  // Return a success response
  return { success: true, message: "Notification marked as read" };
}