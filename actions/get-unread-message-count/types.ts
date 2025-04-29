import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetUnreadMessageCount } from "./schema";

export type InputType = z.infer<typeof GetUnreadMessageCount>;

export type ReturnType = ActionState<
  InputType,
  {
    count: number;
  }
>;