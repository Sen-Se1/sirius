import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { EditMessage } from "./schema";

export type InputType = z.infer<typeof EditMessage>;

export type ReturnType = ActionState<
  InputType,
  {
    message: {
      id: string;
      senderId: string;
      content: string | null;
      fileId: string | null;
      originalFileName: string | null;
      fileType: string | null;
      createdAt: Date;
      isRead: boolean;
    };
  }
>;