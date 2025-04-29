import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface FavoriteWithBoard {
  userId: string;
  boardId: string;
  createdAt: Date;
  board: { title: string };
}

interface FavoritesProps {
  favorites: FavoriteWithBoard[];
  loading: boolean;
}

export const Favorites = ({ favorites, loading }: FavoritesProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="custom_ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
          aria-label="Favorite boards"
        >
          <Star className="h-5 w-5 text-current" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        {loading ? (
          <DropdownMenuItem className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none">
            Loading...
          </DropdownMenuItem>
        ) : favorites.length > 0 ? (
          favorites.map((favorite) => (
            <DropdownMenuItem
              key={favorite.boardId}
              asChild
              className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-md focus:outline-none cursor-pointer transition-colors"
            >
              <Link
                href={`/board/${favorite.boardId}`}
                className="block w-full h-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
              >
                <span className="truncate">{favorite.board.title}</span>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none">
            No favorites
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Favorites;