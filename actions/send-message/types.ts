import { z } from "zod";
import { ChatMessage } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { SendMessage } from "./schema";

export type InputType = z.infer<typeof SendMessage>;

export type ReturnType = ActionState<
  InputType,
  {
    message: ChatMessage;
  }
>;