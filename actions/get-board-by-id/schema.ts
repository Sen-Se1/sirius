import { z } from "zod";

export const GetBoardById = z.object({
  boardId: z
    .string({
      required_error: "Board ID is required",
      invalid_type_error: "Board ID must be a string",
    })
    .min(1, {
      message: "Board ID cannot be empty",
    }),
});