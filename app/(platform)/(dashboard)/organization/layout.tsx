"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "../_components/sidebar";
import { Button } from "@/components/ui/button";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="pt-[64px] px-4 max-w-6xl 2xl:max-w-screen-xl h-full">
      <div className="flex gap-x-1 h-full">
        {isSidebarOpen ? (
          <div className="w-64 shrink-0 md:block hidden px-2 pt-12 border-r-4 bg-white border-neutral-200 dark:border-neutral-700 relative h-full">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-0 right-0 mt-2 mr-2"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Sidebar />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsSidebarOpen(true)}
            className="md:block hidden p-2"
            aria-label="Open sidebar"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        <div className="flex-1 h-full p-2">
          {children}
        </div>
      </div>
    </main>
  );
};

export default OrganizationLayout;
