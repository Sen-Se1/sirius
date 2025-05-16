import { ChecklistItem } from "@prisma/client";
import { CreateChecklistItem } from "./schema";
import { z } from "zod";

export type InputType = z.infer<typeof CreateChecklistItem>;
export type ReturnType = {
  data?: ChecklistItem;
  error?: string;
};