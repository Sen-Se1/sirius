import { z } from "zod";

export const EditMessage = z.object({
  messageId: z.string(),
  content: z.string().min(1, "Message content cannot be empty"),
});