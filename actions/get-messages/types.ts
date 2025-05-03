import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetMessages } from "./schema";

export type GetMessagesInputType = z.infer<typeof GetMessages>;

export type GetMessagesReturnType = ActionState<
  GetMessagesInputType,
  {
    messages: {
      id: string;
      senderId: string;
      content: string | null;
      filePath: string | null;
      originalFileName: string | null;
      fileType: string | null;
      createdAt: Date;
      isRead: boolean;
    }[];
  }
>;