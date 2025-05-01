"use client";

import { X, Search } from "lucide-react";
import { useState } from "react";
import { UIChat } from "@/types";
import Image from "next/image";

interface ProfilePanelProps {
  selectedChatData: UIChat;
  setShowProfile: (show: boolean) => void;
  isVisible?: boolean;
}

export default function ProfilePanel({
  selectedChatData,
  setShowProfile,
  isVisible = true,
}: ProfilePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const userName = `${selectedChatData.recipientFirstName} ${selectedChatData.recipientLastName}`;
  const userPhoto = selectedChatData.recipientPhoto || "/placeholder.svg";

  return (
    <div
      className={`h-full transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full md:w-80 bg-white border-l">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <button
              onClick={() => setShowProfile(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <Image
                width={96}
                height={96}
                src={userPhoto}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-medium">{userName}</h3>
            <p className="text-gray-500">{selectedChatData.recipientEmail}</p>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-medium mb-2">Search for discussion</h3>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={20}
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-4">Shared files</h3>
          <div className="text-center text-gray-500">
            <p className="text-sm">No shared files yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
