"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Favorite } from "@prisma/client";

interface FavoritesProps {
    favorites: Favorite[];
    loading: boolean;
}

const Favorites = ({ favorites, loading }: FavoritesProps) => {
    const router = useRouter();

    const handleFavoriteClick = (boardId: string) => {
        router.push(`/board/${boardId}`);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition duration-200"
                >
                    <Star className="h-5 w-5 text-gray-900 dark:text-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
                {loading ? (
                    <DropdownMenuItem className="text-gray-500 dark:text-gray-400">
                        Loading...
                    </DropdownMenuItem>
                ) : favorites.length > 0 ? (
                    favorites.map((favorite) => (
                        <DropdownMenuItem
                            key={favorite.boardId}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleFavoriteClick(favorite.boardId)}
                        >
                            {favorite.boardId}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem className="text-gray-500 dark:text-gray-400">
                        No favorite
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Favorites;