import { z } from "zod";
import { User } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { GetAllUsers } from "./schema";

export type InputType = z.infer<typeof GetAllUsers>;
export type ReturnType = ActionState<InputType, User[]>;