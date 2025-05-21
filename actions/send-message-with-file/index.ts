"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { uploadToGoogleDrive } from "@/lib/google-drive";

export const sendMessageWithFile = async (formData: FormData) => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const recipientId = formData.get("recipientId") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File | null;

  if (!recipientId) {
    return { error: "Recipient ID is required" };
  }

  if (!content && !file) {
    return { error: "Message content or file is required" };
  }

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

    let fileId: string | undefined;
    let originalFileName: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name}`;
      const mimeType = file.type;
      fileId = await uploadToGoogleDrive(buffer, fileName, mimeType);
      originalFileName = file.name;
      fileType = file.type;
    }

    const message = await db.chatMessage.create({
      data: {
        senderId: userId,
        recipientId,
        content: content || null,
        fileId: fileId || null,
        originalFileName: originalFileName || null,
        fileType: fileType || null,
        isRead: false,
      },
    });

    const messageData = {
      messageId: message.id,
      senderId: userId,
      senderName: sender.firstName,
      content: content || null,
      fileId: fileId || null,
      originalFileName: originalFileName || null,
      fileType: fileType || null,
      createdAt: message.createdAt.toISOString(),
    };

    // Trigger new-message event for recipient
    await pusherServer.trigger(`user-${recipientId}`, "new-message", messageData);
    // Trigger new-message event for sender
    await pusherServer.trigger(`user-${userId}`, "new-message", messageData);

    return { data: { message } };
  } catch (error) {
    console.error("Error sending chat message:", error);
    return { error: "Failed to send message" };
  }
};