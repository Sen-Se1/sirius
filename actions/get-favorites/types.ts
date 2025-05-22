import { z } from "zod";
import { GetFavorites } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof GetFavorites>;

export type ReturnType = ActionState<
  InputType,
  {
    favorites: {
      userId: string;
      boardId: string;
      createdAt: Date;
      board: {
        title: string;
        orgId: string;
        imageThumbUrl?: string;
      };
    }[];
    orgNames: Record<string, string>;
  }
>;