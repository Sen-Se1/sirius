import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";
import { OrgControl } from "./_components/org-control";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findFirst({
    where: {
      id: params.boardId,
      organization: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const board = await db.board.findFirst({
    where: {
      id: params.boardId,
      organization: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">
        <OrgControl orgId={board.orgId} />
        {children}
      </main>
    </div>
  );
};

export default BoardIdLayout;
