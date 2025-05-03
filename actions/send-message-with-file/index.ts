"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import path from "path";
import fs from "fs/promises";

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

    let filePath: string | undefined;
    let originalFileName: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${file.name}`;
      const filePathLocal = path.join(uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePathLocal, new Uint8Array(arrayBuffer));
      filePath = `/uploads/chat/${fileName}`;
      originalFileName = file.name;
      fileType = file.type;
    }

    const message = await db.chatMessage.create({
      data: {
        senderId: userId,
        recipientId,
        content: content || null,
        filePath: filePath || null,
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
      filePath: filePath || null,
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