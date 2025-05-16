import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        OR: [
          { entityId: params.cardId, entityType: ENTITY_TYPE.CARD },
          {
            entityId: params.cardId,
            entityType: ENTITY_TYPE.CHECKLIST,
          },
          {
            entityId: {
              in: await db.checklist
                .findMany({
                  where: { cardId: params.cardId },
                  select: { id: true },
                })
                .then((checklists) => checklists.map((c) => c.id)),
            },
            entityType: ENTITY_TYPE.CHECKLIST,
          },
          {
            entityId: {
              in: await db.checklistItem
                .findMany({
                  where: {
                    checklist: {
                      cardId: params.cardId,
                    },
                  },
                  select: { id: true },
                })
                .then((items) => items.map((i) => i.id)),
            },
            entityType: ENTITY_TYPE.CHECKLIST_ITEM,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}