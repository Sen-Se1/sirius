import { z } from "zod";

export const SendMessage = z.object({
  recipientId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
});

export const GetMessages = z.object({
  recipientId: z.string(),
});