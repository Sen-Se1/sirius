import { z } from "zod";

export const DeleteMessage = z.object({
  messageId: z.string(),
});