import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request, { params }: { params: { boardId: string } }) {
  const { orgId } = auth();

  if (!orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(board);
}