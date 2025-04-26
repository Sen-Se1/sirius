import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetNotificationsSchema } from "./schema";
import { Notification } from "@prisma/client";

export type InputType = z.infer<typeof GetNotificationsSchema>;

export type ReturnType = ActionState<
  InputType,
  {
    notifications: Notification[];
  }
>;