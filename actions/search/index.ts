"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { Search } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Fetch all organizations where the user is a member or admin
  const memberships = await db.member.findMany({
    where: {
      userId,
    },
    select: {
      orgId: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  const orgIds = memberships.map((membership) => membership.orgId);
  const orgNames = memberships.reduce((acc, membership) => {
    acc[membership.orgId] = membership.organization.name;
    return acc;
  }, {} as Record<string, string>);

  if (orgIds.length === 0) {
    return {
      error: "User is not a member of any organization",
    };
  }

  const { query } = data;

  try {
    const results = await db.$transaction(async (prisma) => {
      const boards = await prisma.board.findMany({
        where: {
          orgId: {
            in: orgIds,
          },
          ...(query
            ? {
                title: {
                  contains: query,
                },
              }
            : {}),
        },
        select: {
          id: true,
          title: true,
          orgId: true,
          imageThumbUrl: true,
          createdAt: true,
        },
      });

      const lists = await prisma.list.findMany({
        where: {
          board: {
            orgId: {
              in: orgIds,
            },
          },
          ...(query
            ? {
                title: {
                  contains: query,
                },
              }
            : {}),
        },
        select: {
          id: true,
          title: true,
          boardId: true,
          createdAt: true,
          board: {
            select: {
              orgId: true,
              title: true,
            },
          },
        },
      });

      const cards = await prisma.card.findMany({
        where: {
          list: {
            board: {
              orgId: {
                in: orgIds,
              },
            },
          },
          ...(query
            ? {
                OR: [
                  {
                    title: {
                      contains: query,
                    },
                  },
                  {
                    description: {
                      contains: query,
                    },
                  },
                ],
              }
            : {}),
        },
        select: {
          id: true,
          title: true,
          listId: true,
          createdAt: true,
          list: {
            select: {
              title: true,
              board: {
                select: {
                  id: true,
                  orgId: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return { boards, lists, cards, orgNames };
    });

    return { data: results };
  } catch (error) {
    console.error("Search error:", error);
    return {
      error: "Failed to search.",
    };
  }
};

export const search = createSafeAction(Search, handler);