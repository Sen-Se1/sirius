"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

import { MobileSidebar } from "./mobile-sidebar";
import { useEffect, useState } from "react";
import NavbarSearch from "./nav-search";
import Notifications from "./notifications";
import { computeAverageColor, getLuminance } from "@/lib/helper";
import Favorites from "./favorites-dropdown";
import { Notification } from "@prisma/client";

interface NavbarProps {
  favorites: { userId: string; boardId: string; createdAt: Date; board: { title: string } }[];
  notifications: Notification[];
}

export const Navbar = ({ favorites, notifications }: NavbarProps) => {
  const [board, setBoard] = useState<any>(null);
  const [bgColor, setBgColor] = useState<string>("white");
  const [textColor, setTextColor] = useState<string>("black");
  const pathname = usePathname();

  useEffect(() => {
    const boardId = pathname.startsWith("/board/") ? pathname.split("/")[2] : null;
    if (boardId) {
      fetch(`/api/boards/${boardId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch board");
          }
          return res.json();
        })
        .then((data) => setBoard(data))
        .catch((err) => {
          console.error(err);
          setBoard(null);
        });
    } else {
      setBoard(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (board && board.imageFullUrl) {
      computeAverageColor(board.imageFullUrl)
        .then((color) => {
          setBgColor(color);
          const luminance = getLuminance(color);
          setTextColor(luminance > 0.5 ? "black" : "white");
        })
        .catch((err) => {
          console.error("Failed to compute average color:", err);
          setBgColor("white");
          setTextColor("black");
        });
    } else {
      setBgColor("white");
      setTextColor("black");
    }
  }, [board]);

  return (
    <nav 
      style={{ backgroundColor: bgColor, color: textColor }}
      className="fixed z-50 top-0 px-4 w-full h-16 border-b shadow-sm bg-white flex items-center left-0  justify-between">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
      <NavbarSearch />
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
              },
            },
          }}
        />
        {/* <ThemeToggle /> */}
        <Favorites favorites={favorites} loading={false} />
        <Notifications notifications={notifications} />

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
