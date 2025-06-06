import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { ContactUs } from "./schema";

export type InputType = z.infer<typeof ContactUs>;
export type ReturnType = ActionState<InputType, { message: string }>;