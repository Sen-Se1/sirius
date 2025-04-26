import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { MarkNotificationRead } from "./schema";

export type InputType = z.infer<typeof MarkNotificationRead>;

export type ReturnType = ActionState<
  InputType,
  {
    success: boolean;
  }
>;