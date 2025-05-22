"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetBoardById } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId } = data;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
      select: {
        id: true,
        title: true,
        imageFullUrl: true,
        orgId: true,
        createdAt: true,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    return {
      data: board,
    };
  } catch (error) {
    console.error("Error fetching board:", error);
    return {
      error: "Internal server error",
    };
  }
};

export const getBoardById = createSafeAction(GetBoardById, handler);