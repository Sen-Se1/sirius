import { z } from "zod";

export const SearchUsers = z.object({
  searchTerm: z.string(),
});