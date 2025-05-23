"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { MobileSidebar } from "./mobile-sidebar";
import { useEffect, useState, useCallback, useRef } from "react";
import NavbarSearch from "./nav-search";
import Notifications from "./notifications";
import { computeAverageColor, getLuminance } from "@/lib/helper";
import Favorites from "./favorites-dropdown";
import { Messenger } from "./messenger";
import { useAction } from "@/hooks/use-action";
import { getBoardById } from "@/actions/get-board-by-id";
import { toast } from "sonner";

interface NavbarProps {
  favorites: {
    userId: string;
    boardId: string;
    createdAt: Date;
    board: { title: string; orgId: string; imageThumbUrl?: string };
  }[];
  orgNames: Record<string, string>;
}

export const Navbar = ({ favorites, orgNames }: NavbarProps) => {
  const [board, setBoard] = useState<any>(null);
  const [bgColor, setBgColor] = useState<string>("white");
  const [textColor, setTextColor] = useState<string>("black");
  const pathname = usePathname();
  const cache = useRef<Map<string, any>>(new Map());
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { execute, data, error, isLoading } = useAction(getBoardById, {
    onSuccess: (data) => {
      console.log("Fetched board:", data);
      setBoard(data);
      cache.current.set(data.id, data);
    },
    onError: (err) => {
      console.error("Error fetching board:", err);
      toast.error(err || "Failed to fetch board");
      setBoard(null);
      setBgColor("white");
      setTextColor("black");
    },
  });

  const debouncedExecute = useCallback(
    (boardId: string) => {
      console.log("Debouncing execute for boardId:", boardId);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        execute({ boardId });
      }, 300);
    },
    [execute]
  );

  useEffect(() => {
    console.log("Pathname changed:", pathname);
    const boardId = pathname.startsWith("/board/") ? pathname.split("/")[2] : null;

    const defaultBgColor = "#f8f9fa";
    const defaultTextColor = "black";

    if (!boardId) {
      console.log("No boardId, setting default colors");
      setBoard(null);
      setBgColor(defaultBgColor);
      setTextColor(defaultTextColor);
      cache.current.clear();
      return;
    }

    if (cache.current.has(boardId)) {
      console.log("Using cached board data for ID:", boardId);
      setBoard(cache.current.get(boardId));
    } else {
      console.log("Fetching board for ID:", boardId);
      debouncedExecute(boardId);
    }
  }, [pathname, debouncedExecute]);

  useEffect(() => {
    console.log("Board data updated:", board);
    if (!board || !board.imageFullUrl) {
      console.log("No board or imageFullUrl, setting default colors");
      setBgColor("#f8f9fa");
      setTextColor("black");
      return;
    }

    computeAverageColor(board.imageFullUrl)
      .then((color) => {
        console.log("Computed average color:", color);
        setBgColor(color);
        const luminance = getLuminance(color);
        setTextColor(luminance > 0.5 ? "black" : "white");
      })
      .catch((err) => {
        console.error("Failed to compute average color:", err);
        setBgColor("#f8f9fa");
        setTextColor("black");
      });
  }, [board]);

  return (
    <nav
      style={{ backgroundColor: bgColor, color: textColor }}
      className="fixed z-50 top-0 px-4 w-full h-16 border-b shadow-sm flex items-center justify-between"
    >
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-6">
        <NavbarSearch bgColor={bgColor} textColor={textColor} />
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: textColor,
              },
              organizationSwitcherTrigger: {
                color: textColor,
              },
            },
          }}
        />
        <Favorites
          favorites={favorites}
          loading={isLoading}
          bgColor={bgColor}
          textColor={textColor}
          orgNames={orgNames}
        />
        <Messenger />
        <Notifications bgColor={bgColor} textColor={textColor} />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};