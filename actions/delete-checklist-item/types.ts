import { ChecklistItem } from "@prisma/client";
import { DeleteChecklistItem } from "./schema";
import { z } from "zod";

export type InputType = z.infer<typeof DeleteChecklistItem>;
export type ReturnType = {
  data?: ChecklistItem;
  error?: string;
};