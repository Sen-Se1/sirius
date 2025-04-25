"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetFavorites } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const favorites = await db.favorite.findMany({
      where: { userId },
      include: { board: { select: { title: true } } },
    });

    return {
      data: {
        favorites,
      },
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { error: "Failed to fetch favorites" };
  }
};

export const getFavorites = createSafeAction(GetFavorites, handler);