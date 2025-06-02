import { z } from "zod";
import { User } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { SearchUsers } from "./schema";

export type InputType = z.infer<typeof SearchUsers>;
export type ReturnType = ActionState<InputType, User[]>;