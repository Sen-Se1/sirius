import { Board } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import { BoardFavorite } from "./board-favorite";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const favorite = await db.favorite.findUnique({
    where: {
      userId_boardId: {
        userId,
        boardId: data.id,
      },
    },
  });

  const isFavorite = !!favorite;
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
      <BoardFavorite boardId={data.id} isFavorite={isFavorite} />        
      <BoardOptions id={data.id} />
      </div>
    </div>
  );
};
