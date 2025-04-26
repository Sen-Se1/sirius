import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetNotificationsSchema } from "./schema";

export type InputType = z.infer<typeof GetNotificationsSchema>;

export type ReturnType = ActionState<
  InputType,
  {
    notifications: {
      id: string;
      userId: string;
      senderId?: string;
      orgId?: string;
      message: string;
      isRead: boolean;
      cardId?: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }
>;