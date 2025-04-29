import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { MarkMessagesAsRead } from "./schema";

export type InputType = z.infer<typeof MarkMessagesAsRead>;

export type ReturnType = ActionState<
  InputType,
  { success: boolean }
>;