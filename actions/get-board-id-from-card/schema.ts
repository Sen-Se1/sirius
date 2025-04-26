import { z } from "zod";

export const GetBoardIdFromCard = z.object({
  cardId: z.string(),
});