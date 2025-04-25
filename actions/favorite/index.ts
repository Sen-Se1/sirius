"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { ToggleFavorite } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId } = data;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      orgId,
    },
  });

  if (!board) {
    return {
      error: "Board not found",
    };
  }

  const existingFavorite = await db.favorite.findUnique({
    where: {
      userId_boardId: {
        userId,
        boardId,
      },
    },
  });

  let isFavorite: boolean;

  try {
    if (existingFavorite) {
      await db.favorite.delete({
        where: {
          userId_boardId: {
            userId,
            boardId,
          },
        },
      });
      isFavorite = false;
    } else {
      await db.favorite.create({
        data: {
          userId,
          boardId,
        },
      });
      isFavorite = true;
    }
  } catch (error) {
    return {
      error: "Failed to toggle favorite status.",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: { isFavorite } };
};

export const toggleFavorite = createSafeAction(ToggleFavorite, handler);