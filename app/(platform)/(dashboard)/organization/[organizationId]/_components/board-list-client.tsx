"use client";

import { useState } from "react";
import Link from "next/link";
import { AlignJustify, Grid2x2, HelpCircle, User2 } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import NavbarSearch from "./nav-search";
import Image from "next/image";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { Board } from "@prisma/client";

interface BoardListClientProps {
  boards: Board[];
  availableCount: number;
  isPro: boolean;
}

const BoardListClient = ({ boards, availableCount, isPro }: BoardListClientProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center font-semibold text-lg text-neutral-700">
            <User2 className="h-6 w-6 mr-2" />
            Your boards
          </div>
          <div className="ml-4 flex items-center">
            <Grid2x2
              className={`h-6 w-6 mr-2 cursor-pointer ${
                viewMode === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setViewMode("grid")}
            />
            <AlignJustify
              className={`h-6 w-6 cursor-pointer ${
                viewMode === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setViewMode("list")}
            />
          </div>
        </div>
        <div className="flex items-center">
          <NavbarSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBoards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white">{board.title}</p>
            </Link>
          ))}
          <FormPopover sideOffset={10} side="right">
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
              <span className="text-xs">
                {isPro
                  ? "Unlimited"
                  : `${MAX_FREE_BOARDS - availableCount} remaining`}
              </span>
              <Hint
                sideOffset={40}
                description={`
                  Free Organizations can have up to 5 open boards. For unlimited boards upgrade this organization.
                `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </FormPopover>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBoards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Image
                src={board.imageThumbUrl}
                alt={board.title}
                className="h-10 w-10 mr-2 object-cover rounded-sm"
                width={40}
                height={40}
              />
              <p className="font-semibold">{board.title}</p>
            </Link>
          ))}
          <FormPopover sideOffset={10} side="right">
            <div
              role="button"
              className="p-2 bg-muted rounded-sm relative flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
              <span className="text-xs">
                {isPro
                  ? "Unlimited"
                  : `${MAX_FREE_BOARDS - availableCount} remaining`}
              </span>
              <Hint
                sideOffset={40}
                description={`
            Free Organizations can have up to 5 open boards. For unlimited boards upgrade this organization.
          `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </FormPopover>
        </div>
      )}
    </div>
  );
};

export default BoardListClient;
