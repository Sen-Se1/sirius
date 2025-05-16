import { Checklist } from "@prisma/client";
import { UpdateChecklist } from "./schema";
import { z } from "zod";

export type InputType = z.infer<typeof UpdateChecklist>;
export type ReturnType = {
  data?: Checklist;
  error?: string;
};