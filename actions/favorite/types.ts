import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { ToggleFavorite } from "./schema";

export type InputType = z.infer<typeof ToggleFavorite>;
export type ReturnType = ActionState<InputType, { isFavorite: boolean }>;