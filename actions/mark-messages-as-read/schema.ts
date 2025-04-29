import { z } from "zod";

export const MarkMessagesAsRead = z.object({
  senderId: z.string(),
});