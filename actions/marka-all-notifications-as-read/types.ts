import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { MarkAllNotificationsAsReadSchema } from "./schema";

export type InputType = z.infer<typeof MarkAllNotificationsAsReadSchema>;
export type ReturnType = ActionState<InputType, { success: boolean }>;