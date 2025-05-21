// Sidebar.tsx
"use client";

import { MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UIChat } from "@/types";

interface SidebarProps {
  activeSection: "messages" | "settings";
  setActiveSection: (section: "messages" | "settings") => void;
  setSelectedChat: (chat: UIChat | null) => void;
  setSelectedSettingsPage: (page: string | null) => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  setSelectedChat,
  setSelectedSettingsPage,
}: SidebarProps) {
  return (
    <div className="w-20 bg-white border-r flex flex-col items-center py-6 gap-4 mt-16">
      <Button
        variant="ghost"
        size="icon"
        className={activeSection === "messages" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
        onClick={() => {
          setActiveSection("messages");
          setSelectedSettingsPage(null);
        }}
        aria-label="Messages"
      >
        <MessageSquare size={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={activeSection === "settings" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
        onClick={() => {
          setActiveSection("settings");
          setSelectedChat(null);
        }}
        aria-label="Settings"
      >
        <Settings size={24} />
      </Button>
    </div>
  );
}