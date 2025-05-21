/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { UIChat, UIMessage } from "@/types";
import Image from "next/image";
import { getMessages } from "@/actions/get-messages";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import PreviewImage from "@/components/modals/preview-image";

interface ProfilePanelProps {
  selectedChatData: UIChat;
  setShowProfile: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
  isVisible?: boolean;
}

export default function ProfilePanel({
  selectedChatData,
  setShowProfile,
  setShowSearch,
  isVisible = true,
}: ProfilePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedFiles, setSharedFiles] = useState<UIMessage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { userId } = useAuth();
  const userName = `${selectedChatData.recipientFirstName} ${selectedChatData.recipientLastName}`;
  const userPhoto = selectedChatData.recipientPhoto || "/placeholder.svg";

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "now";
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "now";
    }
  };

  const fetchSharedFiles = async (retryCount = 3, delay = 1000) => {
    if (!selectedChatData.recipientId) {
      return;
    }

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const result = await getMessages({ recipientId: selectedChatData.recipientId });

        if (result.error) {
          if (attempt === retryCount) {
            setFetchError("Failed to load shared files after multiple attempts");
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        const messages = result.data?.messages || [];
        const files = messages.filter((msg) => msg.fileId && msg.fileType);

        setSharedFiles(
          files.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            text: msg.content,
            fileId: msg.fileId,
            originalFileName: msg.originalFileName,
            fileType: msg.fileType,
            time: msg.createdAt ? formatDate(msg.createdAt.toString()) : "now",
            isFromCurrentUser: msg.senderId === userId,
            isRead: msg.isRead,
          }))
        );
        setFetchError(null);
        return;
      } catch (error) {
        if (attempt === retryCount) {
          setFetchError("Unexpected error loading shared files");
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    if (selectedChatData.recipientId && isVisible) {
      fetchSharedFiles();
    }
  }, [selectedChatData.recipientId, isVisible]);

  useEffect(() => {
    if (!userId || !selectedChatData.recipientId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind(
      "new-message",
      (data: {
        messageId: string;
        senderId: string;
        content: string | null;
        fileId: string | null;
        originalFileName: string | null;
        fileType: string | null;
        createdAt: string;
      }) => {
        if (data.fileId && data.fileType) {
          const newFile: UIMessage = {
            id: data.messageId,
            senderId: data.senderId,
            text: data.content,
            fileId: data.fileId,
            originalFileName: data.originalFileName,
            fileType: data.fileType,
            time: formatDate(data.createdAt),
            isFromCurrentUser: data.senderId === userId,
            isRead: data.senderId === userId,
          };
          setSharedFiles((prev) => {
            if (prev.some((file) => file.id === newFile.id && file.fileId === newFile.fileId)) {
              return prev;
            }
            return [...prev, newFile];
          });
        }
      }
    );

    channel.bind("message-deleted", (data: { messageId: string }) => {
      setSharedFiles((prev) => prev.filter((file) => file.id !== data.messageId));
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unbind("new-message");
      pusherClient.unbind("message-deleted");
    };
  }, [userId, selectedChatData.recipientId]);

  return (
    <div
      className={`h-[80px] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full md:w-80 bg-white">
        <div className="p-4 border-b">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <Image
                width={96}
                height={96}
                src={userPhoto}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-medium">{userName}</h3>
            <p className="text-xs text-gray-500">{selectedChatData.recipientEmail}</p>
            <button
              className="flex flex-col items-center gap-1 mt-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowProfile(false);
                setShowSearch(true);
              }}
              aria-label="Open search"
            >
              <div className="bg-gray-500 rounded-full p-2">
                <Search size={16} className="text-white" />
              </div>
              <span className="text-sm text-black">Search</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Shared files</h3>
          </div>
          {fetchError && (
            <div className="text-center text-red-500 mb-2">
              <p className="text-sm">{fetchError}</p>
            </div>
          )}
          {sharedFiles.length === 0 && !fetchError ? (
            <div className="h-[280px] text-center text-gray-500">
              <p className="text-sm">No shared files yet</p>
            </div>
          ) : (
            <div className="h-[280px] overflow-y-auto">
              <div className="space-y-2">
                {sharedFiles.map((file) => (
                  <div key={file.id} className="flex items-center">
                    {file.fileType?.startsWith("image/") ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSelectedImage(`https://drive.google.com/uc?export=view&id=${file.fileId}`)
                        }
                        className="flex items-center space-x-2"
                        aria-label={`View ${file.originalFileName || "image"}`}
                      >
                        <Image
                          src={`https://drive.google.com/uc?export=view&id=${file.fileId}`}
                          alt={file.originalFileName || "Shared image"}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                          onError={() => setFetchError("Failed to load image")}
                        />
                        <span className="text-sm text-gray-700 truncate max-w-[150px]">
                          {file.originalFileName || "Image"}
                        </span>
                      </Button>
                    ) : (
                      <a
                        href={`https://drive.google.com/uc?export=download&id=${file.fileId}`}
                        download={file.originalFileName || "File"}
                        className="flex items-center space-x-2 text-blue-500 hover:underline"
                        aria-label={`Download ${file.originalFileName || "file"}`}
                      >
                        <FileText size={20} className="text-gray-500" />
                        <span className="text-sm truncate max-w-[150px]">
                          {file.originalFileName || "File"}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <PreviewImage
          src={selectedImage}
          alt="Full-size shared image"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}