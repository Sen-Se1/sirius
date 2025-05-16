import { ChecklistItem } from "@prisma/client";
import { UpdateChecklistItem } from "./schema";
import { z } from "zod";

export type InputType = z.infer<typeof UpdateChecklistItem>;
export type ReturnType = {
  data?: ChecklistItem;
  error?: string;
};