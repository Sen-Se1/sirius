"use client";

import { useEffect, useState } from "react";
import Sidebar from "./_components/sidebar";
import ChatList from "./_components/chat-list";
import ChatHeader from "./_components/chat-header";
import Conversation from "./_components/conversation";
import { UIChat, UIMessage } from "@/types";
import ProfilePanel from "./_components/profile-panel";
import SearchPanel from "./_components/search-panel";
import { getUnreadCountsPerSender } from "@/actions/get-unread-counts-per-sender";

interface UnreadCounts {
  [senderId: string]: number;
}

export default function Chat() {
  const [activeSection, setActiveSection] = useState<"messages" | "settings">("messages");
  const [selectedChat, setSelectedChat] = useState<UIChat | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
  const [realtimeMessages, setRealtimeMessages] = useState<UIMessage[]>([]);
  const [searchResults, setSearchResults] = useState<UIMessage[]>([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const result = await getUnreadCountsPerSender({});
      if (result.data) {
        setUnreadCounts(result.data);
      }
    };
    fetchUnreadCounts();
  }, []);

  const handleMessageClick = (messageId: string) => {
    setHighlightedMessageId(messageId);
  };

  const handleSearchPerformed = (newSearchTerm: string) => {
    // Clear highlight if a new search is performed (different search term)
    if (searchResults.length > 0 && newSearchTerm !== searchResults[0]?.text) {
      setHighlightedMessageId(null);
    }
  };

  const handleInputCleared = () => {
    // Clear highlight when input is cleared
    setHighlightedMessageId(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <ChatList
        activeSection={activeSection}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        unreadCounts={unreadCounts}
        setUnreadCounts={setUnreadCounts}
      />
      <div className="flex-1 bg-gray-50 h-[calc(100vh-64px)] mt-16 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChatData={selectedChat}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
            <div className="flex-1 flex">
              <Conversation
                selectedChat={selectedChat}
                showProfile={showProfile}
                setUnreadCounts={setUnreadCounts}
                realtimeMessages={searchResults.length > 0 ? searchResults : undefined}
                setRealtimeMessages={setRealtimeMessages}
                highlightedMessageId={highlightedMessageId}
                setHighlightedMessageId={setHighlightedMessageId}
              />
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showProfile || showSearch ? "w-full md:w-80 opacity-100" : "w-0 opacity-0"
                }`}
              >
                {showSearch ? (
                  <SearchPanel
                    setShowSearch={setShowSearch}
                    setShowProfile={setShowProfile}
                    isVisible={showSearch}
                    realtimeMessages={realtimeMessages}
                    setSearchResults={setSearchResults}
                    onMessageClick={handleMessageClick}
                    onSearchPerformed={handleSearchPerformed}
                    onInputCleared={handleInputCleared}
                  />
                ) : (
                  <ProfilePanel
                    selectedChatData={selectedChat}
                    setShowProfile={setShowProfile}
                    setShowSearch={setShowSearch}
                    isVisible={showProfile}
                  />
                )}
              </div>
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