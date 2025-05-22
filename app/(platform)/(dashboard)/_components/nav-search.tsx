"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { search } from "@/actions/search";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import Link from "next/link";
import { X, Layout, List, CreditCard } from "lucide-react";
import Image from "next/image";

interface NavbarSearchProps {
  bgColor: string;
  textColor: string;
}

const NavbarSearch = ({ bgColor, textColor }: NavbarSearchProps) => {
  const inputBgColor = textColor === "black" ? "#f0f0f0" : "#2d2d2d";
  const dropdownBgColor = textColor === "black" ? "#ffffff" : "#1a1a1a";
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, data, error, isLoading, fieldErrors, reset } = useAction(search, {
    onSuccess: (data) => {
      console.log("Search success:", data);
      setHasSearched(true);
    },
    onError: (err) => {
      console.error("Search error:", err);
      if (fieldErrors?.query) {
        const errorMessage = fieldErrors.query.join(", ");
        toast.error(errorMessage);
        setIsOpen(false);
      } else {
        toast.error(err || "An unexpected error occurred");
      }
      setHasSearched(true);
    },
    onComplete: () => {
      console.log("Search completed");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed:", value, "isOpen:", !!value.trim());
    setQuery(value);
    setIsOpen(!!value.trim());
    setHasSearched(false);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Enter") {
      console.log("Enter pressed, executing search with query:", query);
      execute({ query: query || "" });
    } else if (e.key === "Escape") {
      console.log("Escape pressed, closing dropdown");
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClearInput = () => {
    console.log("Clearing input");
    setQuery("");
    setIsOpen(false);
    setHasSearched(false);
    reset();
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    console.log("Result clicked, clearing input");
    setQuery("");
    setIsOpen(false);
    setHasSearched(false);
    reset();
  };

  const handleFocus = () => {
    console.log("Input focused, isOpen:", !!query.trim(), "hasFocused:", hasFocused);
    setHasFocused(true);
    if (query.trim() || hasSearched) setIsOpen(true);
  };

  const handleBlur = () => {
    console.log("Input blurred");
    setTimeout(() => {
      console.log("Closing dropdown after blur");
      setIsOpen(false);
    }, 200);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="relative flex items-center max-w-md">
      <div className="relative w-96">
        <Input
          ref={inputRef}
          placeholder="Search boards, lists, cards..."
          className="h-9 w-full rounded-lg border-2 border-gray-200 bg-opacity-80 px-4 py-2 pr-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-800"
          style={{
            backgroundColor: inputBgColor,
            color: textColor,
          }}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        {query && (
          <button
            onClick={handleClearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          className="absolute top-12 left-0 w-96 max-h-96 overflow-y-auto z-[1000] rounded-xl shadow-2xl border border-gray-200 bg-opacity-95 transition-all duration-200 ease-in-out transform animate-fadeIn dark:border-gray-700"
          style={{ backgroundColor: dropdownBgColor, color: textColor }}
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
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
              Searching...
            </div>
          )}
          {error && (
            <div className="px-4 py-3 text-sm text-red-500 dark:text-red-400 flex items-center gap-3">
              <span>Error:</span> {error}
            </div>
          )}
          {data && hasSearched && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.boards?.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <Layout className="h-4 w-4" />
                    Boards
                  </div>
                  {data.boards.map((board) => (
                    <Link
                      key={board.id}
                      href={`/board/${board.id}`}
                      onClick={handleResultClick}
                      className="group flex flex-col gap-1 px-3 py-3 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      aria-label={`Go to board: ${board.title} in ${data.orgNames[board.orgId] || "Unknown Organization"}`}
                    >
                      <div className="flex items-center gap-3">
                        {board.imageThumbUrl ? (
                          <Image
                            src={board.imageThumbUrl}
                            width={16}
                            height={16}
                            alt=""
                            className="h-4 w-4 rounded-sm object-cover"
                          />
                        ) : (
                          <Layout className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        )}
                        <span className="font-medium truncate">{board.title}</span>
                      </div>
                      <div className="ml-7 text-xs text-gray-500 dark:text-gray-400 truncate">
                        Organization: {data.orgNames[board.orgId] || "Unknown Organization"}
                      </div>
                      <div className="ml-7 text-xs text-gray-400 dark:text-gray-500">
                        Created: {formatDate(new Date(board.createdAt))}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {data.lists?.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <List className="h-4 w-4" />
                    Lists
                  </div>
                  {data.lists.map((list) => (
                    <Link
                      key={list.id}
                      href={`/board/${list.boardId}`}
                      onClick={handleResultClick}
                      className="group flex flex-col gap-1 px-3 py-3 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      aria-label={`Go to list: ${list.title} in board: ${list.board.title} in ${data.orgNames[list.board.orgId] || "Unknown Organization"}`}
                    >
                      <div className="flex items-center gap-3">
                        <List className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="font-medium truncate">{list.title}</span>
                      </div>
                      <div className="ml-7 text-xs text-gray-500 dark:text-gray-400 truncate">
                        Board: {list.board.title} / Organization: {data.orgNames[list.board.orgId] || "Unknown Organization"}
                      </div>
                      <div className="ml-7 text-xs text-gray-400 dark:text-gray-500">
                        Created: {formatDate(new Date(list.createdAt))}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {data.cards?.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <CreditCard className="h-4 w-4" />
                    Cards
                  </div>
                  {data.cards.map((card) => (
                    <Link
                      key={card.id}
                      href={`/board/${card.list.board.id}`}
                      onClick={handleResultClick}
                      className="group flex flex-col gap-1 px-3 py-3 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      aria-label={`Go to card: ${card.title} in list: ${card.list.title} in board: ${card.list.board.title} in ${data.orgNames[card.list.board.orgId] || "Unknown Organization"}`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="font-medium truncate">{card.title}</span>
                      </div>
                      <div className="ml-7 text-xs text-gray-500 dark:text-gray-400 truncate">
                        List: {card.list.title} / Board: {card.list.board.title} / Organization: {data.orgNames[card.list.board.orgId] || "Unknown Organization"}
                      </div>
                      <div className="ml-7 text-xs text-gray-400 dark:text-gray-500">
                        Created: {formatDate(new Date(card.createdAt))}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {!isLoading &&
                data.boards?.length === 0 &&
                data.lists?.length === 0 &&
                data.cards?.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                    No results found
                  </div>
                )}
            </div>
          )}
          {!isLoading && !data && !error && !hasSearched && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Press &quot;Enter&quot; to search or view all items
            </div>
          )}
          {!isLoading && !query.trim() && !hasFocused && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Start typing to search or press &quot;Enter&quot; to view all
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;