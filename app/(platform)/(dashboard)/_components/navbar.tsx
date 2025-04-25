"use client";

import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NavbarSearch from "./nav-search";
import Notifications from "./notifications";
import { Notification } from "@/types";
import { computeAverageColor, getLuminance } from "@/lib/helper";
import Favorites from "./favorites-dropdown";

export const Navbar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<any>(null);
  const [bgColor, setBgColor] = useState<string>("white");
  const [textColor, setTextColor] = useState<string>("black");
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dummyNotifications: Notification[] = [
          { id: "1", message: "Notification 1", isRead: false },
          { id: "2", message: "Notification 2", isRead: false },
          { id: "3", message: "Notification 3", isRead: true },
        ];
        setNotifications(dummyNotifications);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Échec du chargement des favoris. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        {/* <FormPopover align="start" side="bottom" sideOffset={18}>
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm hidden md:block h-auto  py-1.5 px-2"
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover>
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm block md:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </FormPopover> */}
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
        <Favorites loading={loading} />
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
