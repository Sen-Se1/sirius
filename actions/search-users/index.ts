"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { SearchUsers } from "./schema";
import { SearchUsersInput, SearchUsersReturn } from "./types";

const handler = async (data: SearchUsersInput): Promise<SearchUsersReturn> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { searchTerm } = data;

  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      },
    });

    return { data: users };
  } catch (error) {
    return {
      error: "Failed to search users.",
    };
  }
};

export const searchUsers = createSafeAction(SearchUsers, handler);