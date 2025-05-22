import { z } from "zod";

export const Search = z.object({
  query: z
    .string({
      required_error: "Search query is required",
      invalid_type_error: "Search query must be a string",
    })
    .min(1, {
      message: "Search query cannot be empty",
    }),
});