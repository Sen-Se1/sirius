"use client"

import { MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: "messages" | "conversation" | "settings"
  setActiveSection: (section: "messages" | "settings") => void
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <div className="w-20 bg-white border-r flex flex-col items-center py-6 gap-4 mt-16">
      <Button
        variant="ghost"
        size="icon"
        className={activeSection === "messages" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
        onClick={() => setActiveSection("messages")}
        aria-label="Messages"
      >
        <MessageSquare size={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={activeSection === "settings" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
        onClick={() => setActiveSection("settings")}
        aria-label="Settings"
      >
        <Settings size={24} />
      </Button>
    </div>
  )
}