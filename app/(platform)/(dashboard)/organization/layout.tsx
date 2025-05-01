"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "../_components/sidebar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="pt-[64px] px-4 w-6xl h-full flex flex-col overflow-hidden">
      <div className="flex flex-1 h-full">
        <div
          className={clsx(
            "relative transition-all duration-300 ease-in-out h-full ml-[-16px] bg-white shrink-0",
            isSidebarOpen ? "w-64" : "w-0"
          )}
        >
          <div
            className={clsx(
              "h-full transition-opacity duration-300 ease-in-out",
              isSidebarOpen
                ? "opacity-100 px-2 pt-12"
                : "opacity-0 overflow-hidden"
            )}
          >
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-0 right-0 mt-2 mr-2"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Sidebar />
          </div>
        </div>

        {!isSidebarOpen && (
          <div className="flex items-start p-2">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2"
              aria-label="Open sidebar"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        <div className="flex-1 h-full p-2 overflow-auto">{children}</div>
      </div>
    </main>
  );
};

export default OrganizationLayout;
