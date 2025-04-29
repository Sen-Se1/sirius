"use client";

import { useEffect, useState } from "react";
import { Search, Settings, User } from "lucide-react";
import Image from "next/image";
import { User as UserType } from "@prisma/client";
import { getAllUsers } from "@/actions/get-all-users";
import { UIChat } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ChatListProps {
  userId: string;
  activeSection: "messages" | "settings";
  selectedChat: UIChat | null;
  setSelectedChat: (chat: UIChat | null) => void;
}

export default function ChatList({
  userId,
  activeSection,
  selectedChat,
  setSelectedChat,
}: ChatListProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers({});
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
  }, []);

  const filteredUsers = users
    .filter((user) => user.id !== userId)
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          {filteredUsers.map((user) => (
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full text-left justify-start hover:bg-gray-50"
              aria-label="Profile"
            >
              <User size={20} className="text-gray-600 mr-3" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left justify-start hover:bg-gray-50"
              aria-label="Preferences"
            >
              <Settings size={20} className="text-gray-600 mr-3" />
              Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}