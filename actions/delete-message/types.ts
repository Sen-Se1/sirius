import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteMessage } from "./schema";

export type InputType = z.infer<typeof DeleteMessage>;

export type ReturnType = ActionState<InputType, { messageId: string }>;
