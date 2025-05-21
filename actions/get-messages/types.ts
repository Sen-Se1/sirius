import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetMessages } from "./schema";

export type InputType = z.infer<typeof GetMessages>;

export type ReturnType = ActionState<
  InputType,
  {
    messages: {
      id: string;
      senderId: string;
      content: string | null;
      fileId: string | null;
      originalFileName: string | null;
      fileType: string | null;
      createdAt: Date;
      isRead: boolean;
    }[];
  }
>;