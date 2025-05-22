"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Settings,
  User,
  Bell,
  Palette,
  Lock,
  HelpCircle,
  Info,
  Languages,
  Database,
} from "lucide-react";
import Image from "next/image";
import { User as UserType } from "@prisma/client";
import { getAllUsers } from "@/actions/get-all-users";
import { searchUsers } from "@/actions/search-users";
import { UIChat } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@clerk/nextjs";

interface UnreadCounts {
  [senderId: string]: number;
}

interface ChatListProps {
  activeSection: "messages" | "settings";
  selectedChat: UIChat | null;
  setSelectedChat: (chat: UIChat | null) => void;
  unreadCounts: UnreadCounts;
  setUnreadCounts: React.Dispatch<React.SetStateAction<UnreadCounts>>;
  setSelectedSettingsPage: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSettingsPage: string | null;
}

export default function ChatList({
  activeSection,
  selectedChat,
  setSelectedChat,
  unreadCounts,
  setUnreadCounts,
  setSelectedSettingsPage,
  selectedSettingsPage,
}: ChatListProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useAuth();
  const settingsOptions = [
    { page: "language", icon: Languages, label: "Language" },
    { page: "preferences", icon: Settings, label: "Preferences" },
    { page: "data-management", icon: Database, label: "Data Management" },
    { page: "notifications", icon: Bell, label: "Notifications" },
    { page: "appearance", icon: Palette, label: "Appearance" },
    { page: "privacy", icon: Lock, label: "Privacy" },
    { page: "help-support", icon: HelpCircle, label: "Help & Support" },
    { page: "about", icon: Info, label: "About" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let result;
        if (searchTerm.trim()) {
          result = await searchUsers({ searchTerm });
        } else {
          result = await getAllUsers({});
        }
        if (result.error) {
          console.error("Error fetching users:", result.error);
          return;
        }
        setUsers(result.data || []);
      } catch (error) {
        console.error("Unexpected error fetching users:", error);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-message", (data: { senderId: string }) => {
      if (selectedChat?.recipientId !== data.senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unbind("new-message");
    };
  }, [userId, selectedChat, setUnreadCounts]);

  return (
    <div className="w-80 bg-white border-r h-[calc(100vh-64px)] mt-16 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">
            {activeSection === "messages" ? "Chats" : "Settings"}
          </h1>
        </div>
        {activeSection === "messages" && (
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 bg-gray-100 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>
        )}
      </div>
      {activeSection === "messages" ? (
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {users
            .filter((user) => user.id !== userId)
            .map((user) => (
              <Card
                key={user.id}
                className={`border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === user.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  const chatData: UIChat = {
                    id: user.id,
                    recipientId: user.id,
                    recipientFirstName: user.firstName,
                    recipientLastName: user.lastName,
                    recipientEmail: user.email,
                    recipientPhoto: user.photo,
                  };
                  setSelectedChat(chatData);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {user.photo ? (
                        <Image
                          src={user.photo}
                          width={48}
                          height={48}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={24} className="text-gray-600" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <div className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadCounts[user.id]}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-2">
            {settingsOptions.map(({ page, icon: Icon, label }) => (
              <Button
                key={page}
                variant="ghost"
                className={`w-full text-left justify-start hover:bg-gray-50 text-gray-700 ${
                  selectedSettingsPage === page
                    ? "bg-blue-100 text-blue-600"
                    : ""
                }`}
                onClick={() => setSelectedSettingsPage(page)}
                aria-label={label}
              >
                <Icon size={20} className="text-gray-600 mr-3" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
