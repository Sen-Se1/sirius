import { z } from "zod";

export const ToggleFavorite = z.object({
  boardId: z.string({
    required_error: "Board ID is required",
    invalid_type_error: "Board ID must be a string",
  }),
});