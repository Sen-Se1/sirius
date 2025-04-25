import { z } from "zod";
import { Favorite } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { GetFavorites } from "./schema";

export type InputType = z.infer<typeof GetFavorites>;

export type ReturnType = ActionState<
  InputType,
  {
    favorites: (Favorite & { board: { title: string } })[];
  }
>;