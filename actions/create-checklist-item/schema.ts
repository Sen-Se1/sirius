import { z } from "zod";

export const CreateChecklistItem = z.object({
  checklistId: z.string(),
  title: z.string().min(1, "Title is required"),
});