import { z } from "zod";

export const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Priority is required",
  }),
  boardId: z.string(),
  listId: z.string(),
});
