import { Checklist } from "@prisma/client";
import { DeleteChecklist } from "./schema";
import { z } from "zod";

export type InputType = z.infer<typeof DeleteChecklist>;
export type ReturnType = {
  data?: Checklist;
  error?: string;
};