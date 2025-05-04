import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetBoardIdFromCard } from "./schema";

export type InputType = z.infer<typeof GetBoardIdFromCard>;

export type ReturnType = ActionState<InputType, { boardId: string }>;
