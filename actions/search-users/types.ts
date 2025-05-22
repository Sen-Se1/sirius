import { z } from "zod";
import { User } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { SearchUsers } from "./schema";

export type SearchUsersInput = z.infer<typeof SearchUsers>;
export type SearchUsersReturn = ActionState<SearchUsersInput, User[]>;