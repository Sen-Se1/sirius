import { z } from "zod";

export const GetMessages = z.object({
  recipientId: z.string(),
});