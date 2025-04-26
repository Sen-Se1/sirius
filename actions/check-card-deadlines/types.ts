import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { CheckCardDeadlines } from "./schema";

export type InputType = z.infer<typeof CheckCardDeadlines>;

export type ReturnType = ActionState<
  InputType,
  {
    notificationsCreated: number;
  }
>;