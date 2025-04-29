"use client";

import { useState } from "react";
import Sidebar from "./_components/sidebar";
import ChatList from "./_components/chat-list";
import ChatHeader from "./_components/chat-header";
import Conversation from "./_components/conversation";
import { UIChat } from "@/types";
import { useAuth } from "@clerk/nextjs";
import ProfilePanel from "./_components/profile-panel";

export default function Chat() {
  const [activeSection, setActiveSection] = useState<"messages" | "settings">(
    "messages"
  );
  const [selectedChat, setSelectedChat] = useState<UIChat | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const { userId } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <ChatList
        userId={userId || ""}
        activeSection={activeSection}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <div className="flex-1 bg-gray-50 h-[calc(100vh-64px)] mt-16 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChatData={selectedChat}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
            />
            <div className="flex-1 flex">
              <Conversation
                selectedChat={selectedChat}
                showProfile={showProfile}
                userId={userId || ""}
              />
              {/* {showProfile && <ProfilePanel selectedChatData={selectedChat} setShowProfile={setShowProfile} />} */}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
