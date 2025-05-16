import { z } from "zod";

import { Checklist } from "@prisma/client";
import { CreateChecklist } from "./schema";

export type InputType = z.infer<typeof CreateChecklist>;
export type ReturnType = {
  data?: Checklist;
  error?: string;
};