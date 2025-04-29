import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { MarkNotificationAsReadSchema } from "./schema";

export type InputType = z.infer<typeof MarkNotificationAsReadSchema>;

export type ReturnType = ActionState<
  InputType,
  {
    success: boolean;
  }
>;