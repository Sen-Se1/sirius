"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetBoardIdFromCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { cardId } = data;

  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!card) {
      return { error: "Card not found" };
    }

    return {
      data: { boardId: card.list.board.id },
    };
  } catch (error) {
    console.error("Error fetching board ID from card:", error);
    return { error: "Failed to fetch board ID" };
  }
};

export const getBoardIdFromCard = createSafeAction(GetBoardIdFromCard, handler);