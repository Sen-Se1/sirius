"use server";

import { auth } from "@clerk/nextjs/server";
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
      include: {
        board: {
          select: {
            title: true,
            orgId: true,
            imageThumbUrl: true,
          },
        },
      },
    });

    const orgIds = Array.from(new Set(favorites.map((f) => f.board.orgId)));
    const organizations = await db.organization.findMany({
      where: { id: { in: orgIds } },
      select: { id: true, name: true },
    });

    const orgNames = organizations.reduce((acc, org) => {
      acc[org.id] = org.name;
      return acc;
    }, {} as Record<string, string>);

    return {
      data: {
        favorites,
        orgNames,
      },
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { error: "Failed to fetch favorites" };
  }
};

export const getFavorites = createSafeAction(GetFavorites, handler);