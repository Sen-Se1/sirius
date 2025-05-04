import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetUnreadCountsPerSender } from "./schema";

export type InputType = z.infer<typeof GetUnreadCountsPerSender>;

export type ReturnType = ActionState<InputType, Record<string, number>>; // { senderId: unreadCount }
