"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetAllUsers } from "./schema";
import { GetAllUsersInput, GetAllUsersReturn } from "./types";

const handler = async (data: GetAllUsersInput): Promise<GetAllUsersReturn> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const members = await db.member.findMany({
      include: {
        user: true,
      },
    });

    const users = members.map((member) => member.user);

    return { data: users };
  } catch (error) {
    return {
      error: "Failed to fetch users.",
    };
  }
};

export const getAllUsers = createSafeAction(GetAllUsers, handler);