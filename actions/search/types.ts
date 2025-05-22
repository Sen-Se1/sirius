import { z } from "zod";
import { Board, Card, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { Search } from "./schema";

export type InputType = z.infer<typeof Search>;
export type ReturnType = ActionState<
  InputType,
  {
    boards: Pick<Board, "id" | "title" | "orgId" | "imageThumbUrl" | "createdAt">[];
    lists: (Pick<List, "id" | "title" | "boardId" | "createdAt"> & {
      board: Pick<Board, "orgId" | "title">;
    })[];
    cards: (Pick<Card, "id" | "title" | "listId" | "createdAt"> & {
      list: {
        title: string;
        board: Pick<Board, "id" | "orgId" | "title">;
      };
    })[];
    orgNames: Record<string, string>;
  }
>;