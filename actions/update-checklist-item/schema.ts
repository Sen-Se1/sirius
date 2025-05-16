import { z } from "zod";

export const UpdateChecklistItem = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  checked: z.boolean().optional(),
  boardId: z.string(),
});