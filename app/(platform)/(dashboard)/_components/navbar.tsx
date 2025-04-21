"use client";

import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NavbarSearch from "./nav-search";
import Notifications from "./notifications";
import { Notification } from "@/types";

export const Navbar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
  
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-16 border-b shadow-sm bg-white flex items-center left-0  justify-between">
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
