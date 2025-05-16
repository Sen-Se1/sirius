import { z } from "zod";

export const CreateChecklist = z.object({
  cardId: z.string(),
  title: z.string().min(1, "Title is required"),
});