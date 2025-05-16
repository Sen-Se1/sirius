import { z } from "zod";

export const UpdateChecklist = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  boardId: z.string(),
});