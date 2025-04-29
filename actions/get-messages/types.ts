import { z } from "zod";
import { ChatMessage } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { SendMessage, GetMessages } from "./schema";

export type SendMessageInputType = z.infer<typeof SendMessage>;
export type SendMessageReturnType = ActionState<
  SendMessageInputType,
  { message: ChatMessage }
>;

export type GetMessagesInputType = z.infer<typeof GetMessages>;
export type GetMessagesReturnType = ActionState<
  GetMessagesInputType,
  { messages: ChatMessage[] }
>;