"use client";

import { Star, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

interface FavoriteWithBoard {
  userId: string;
  boardId: string;
  createdAt: Date;
  board: {
    title: string;
    orgId: string;
    imageThumbUrl?: string;
  };
}

interface FavoritesProps {
  favorites: FavoriteWithBoard[];
  loading: boolean;
  bgColor: string; // Added to match NavbarSearch
  textColor: string; // Added to match NavbarSearch
  orgNames: Record<string, string>; // Organization names for display
}

export const Favorites = ({ favorites, loading, bgColor, textColor, orgNames }: FavoritesProps) => {
  const dropdownBgColor = textColor === "black" ? "#ffffff" : "#1a1a1a";

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="custom_ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
          aria-label="Favorite boards"
          style={{ color: textColor }}
        >
          <Star className="h-5 w-5 text-current" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 max-h-96 overflow-y-auto z-[1000] rounded-xl shadow-2xl border border-gray-200 bg-opacity-95 transition-all duration-200 ease-in-out transform animate-fadeIn dark:border-gray-700"
        style={{ backgroundColor: dropdownBgColor, color: textColor }}
      >
        {loading ? (
          <DropdownMenuItem className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3 cursor-default select-none">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </DropdownMenuItem>
        ) : favorites.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
                <Star className="h-4 w-4" />
                Favorite Boards
              </div>
              {favorites.map((favorite) => (
                <DropdownMenuItem
                  key={favorite.boardId}
                  asChild
                  className="p-0 focus:outline-none"
                >
                  <Link
                    href={`/board/${favorite.boardId}`}
                    className="group flex flex-col gap-1 px-3 py-3 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 w-full"
                    aria-label={`Go to favorite board: ${favorite.board.title} in ${orgNames[favorite.board.orgId] || "Unknown Organization"}`}
                  >
                    <div className="flex items-center gap-3">
                      {favorite.board.imageThumbUrl ? (
                        <Image
                          src={favorite.board.imageThumbUrl}
                          width={16}
                          height={16}
                          alt=""
                          className="h-4 w-4 rounded-sm object-cover"
                        />
                      ) : (
                        <Layout className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                      )}
                      <span className="font-medium truncate">{favorite.board.title}</span>
                    </div>
                    <div className="ml-7 text-xs text-gray-500 dark:text-gray-400 truncate">
                      Organization: {orgNames[favorite.board.orgId] || "Unknown Organization"}
                    </div>
                    <div className="ml-7 text-xs text-gray-400 dark:text-gray-500">
                      Created: {formatDate(new Date(favorite.createdAt))}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        ) : (
          <DropdownMenuItem className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none">
            No favorite boards
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Favorites;