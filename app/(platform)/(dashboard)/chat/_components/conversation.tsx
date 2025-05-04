/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import { Send, ImageIcon, FileText, Check, CheckCheck, X, Smile } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { getMessages } from "@/actions/get-messages";
import { sendMessageWithFile } from "@/actions/send-message-with-file";
import { UIChat, UIMessage } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUnreadMessageContext } from "@/components/providers/unread-message-provider";
import { markMessagesAsRead } from "@/actions/mark-messages-as-read";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import PreviewImage from "@/components/modals/preview-image";
import EmojiPicker from "./emoji-picker";

interface UnreadCounts {
  [senderId: string]: number;
}

interface ConversationProps {
  selectedChat?: UIChat;
  showProfile?: boolean;
  setUnreadCounts: React.Dispatch<React.SetStateAction<UnreadCounts>>;
  realtimeMessages?: UIMessage[];
  setRealtimeMessages: React.Dispatch<React.SetStateAction<UIMessage[]>>;
  highlightedMessageId: string | null;
  setHighlightedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Conversation = ({
  selectedChat,
  showProfile = false,
  setUnreadCounts,
  realtimeMessages: propRealtimeMessages,
  setRealtimeMessages,
  highlightedMessageId,
  setHighlightedMessageId,
}: ConversationProps) => {
  const [realtimeMessages, setLocalRealtimeMessages] = useState<UIMessage[]>(propRealtimeMessages || []);
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUnreadCount } = useUnreadMessageContext();
  const { userId } = useAuth();

  const formatDate = (dateStr: string | Date): string => {
    try {
      const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
      if (isNaN(date.getTime())) return "now";
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "now";
    }
  };

  const fetchMessages = async (recipientId: string): Promise<UIMessage[]> => {
    setIsLoading(true);
    const result = await getMessages({ recipientId });
    if (result.error) {
      console.error(result.error);
      setIsLoading(false);
      return [];
    }
    const apiMessages = result.data?.messages || [];
    const formattedMessages = apiMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      text: msg.content,
      filePath: msg.filePath,
      originalFileName: msg.originalFileName,
      fileType: msg.fileType,
      time: msg.createdAt ? formatDate(msg.createdAt) : "now",
      isFromCurrentUser: msg.senderId === userId,
      isRead: msg.isRead,
    }));
    setIsLoading(false);
    return formattedMessages;
  };

  useEffect(() => {
    if (!userId || !selectedChat) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind(
      "new-message",
      (data: {
        messageId: string;
        senderId: string;
        content: string | null;
        filePath: string | null;
        originalFileName: string | null;
        fileType: string | null;
        createdAt: string;
      }) => {
        if (data.senderId === selectedChat.recipientId) {
          const newMessage = {
            id: data.messageId,
            senderId: data.senderId,
            text: data.content,
            filePath: data.filePath,
            originalFileName: data.originalFileName,
            fileType: data.fileType,
            time: formatDate(data.createdAt),
            isFromCurrentUser: false,
            isRead: false,
          };
          setLocalRealtimeMessages((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            const updatedMessages = [...prev, newMessage];
            setRealtimeMessages(updatedMessages);
            return updatedMessages;
          });
          scrollToBottom();
          markMessagesAsRead({ senderId: data.senderId }).then((result) => {
            if (result.data) {
              setUnreadCount(result.data.newUnreadCount);
              setUnreadCounts((prev) => ({
                ...prev,
                [data.senderId]: 0,
              }));
            }
          });
        }
      }
    );

    channel.bind(
      "message-read",
      (data: { messageIds: string[]; senderId: string }) => {
        if (data.senderId === selectedChat.recipientId) {
          setLocalRealtimeMessages((prev) => {
            const updatedMessages = prev.map((msg) =>
              data.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
            );
            setRealtimeMessages(updatedMessages);
            return updatedMessages;
          });
        }
      }
    );

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unbind("new-message");
      pusherClient.unbind("message-read");
    };
  }, [userId, selectedChat?.recipientId]);

  useEffect(() => {
    if (selectedChat && userId) {
      setLocalRealtimeMessages([]);
      fetchMessages(selectedChat.recipientId).then((formattedMessages) => {
        setLocalRealtimeMessages(formattedMessages);
        setRealtimeMessages(formattedMessages);
        scrollToBottom();
        markMessagesAsRead({ senderId: selectedChat.recipientId }).then(
          (result) => {
            if (result.data) {
              setUnreadCount(result.data.newUnreadCount);
              setUnreadCounts((prev) => ({
                ...prev,
                [selectedChat.recipientId]: 0,
              }));
            }
          }
        );
      });
    }
  }, [selectedChat?.recipientId, userId]);

  useEffect(() => {
    if (selectedChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [realtimeMessages]);

  useEffect(() => {
    if (highlightedMessageId && messageRefs.current[highlightedMessageId]) {
      messageRefs.current[highlightedMessageId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedMessageId]);

  const onSendMessageHandler = async () => {
    if ((message.trim() || selectedFile) && userId && selectedChat && !isSending) {
      const tempId = `temp-${Date.now()}`;
      const messageText = message.trim();
      const currentTime = formatDate(new Date());

      setIsSending(true);

      const newMessage = {
        id: tempId,
        senderId: userId,
        text: messageText || null,
        filePath: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
        originalFileName: selectedFile ? selectedFile.name : undefined,
        fileType: selectedFile ? selectedFile.type : undefined,
        time: currentTime,
        isFromCurrentUser: true,
        isPending: true,
        isRead: false,
      };

      setLocalRealtimeMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        setRealtimeMessages(updatedMessages);
        return updatedMessages;
      });
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const formData = new FormData();
      formData.append("recipientId", selectedChat.recipientId);
      if (messageText) {
        formData.append("content", messageText);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      try {
        const result = await sendMessageWithFile(formData);
        if (result.error) {
          throw new Error(result.error);
        }

        const serverMessage = result.data?.message;
        setLocalRealtimeMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  id: serverMessage?.id ?? tempId,
                  filePath: serverMessage?.filePath ?? msg.filePath,
                  originalFileName: serverMessage?.originalFileName ?? msg.originalFileName,
                  fileType: serverMessage?.fileType ?? msg.fileType,
                  isPending: false,
                  isRead: serverMessage?.isRead ?? false,
                }
              : msg
          );
          setRealtimeMessages(updatedMessages);
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error sending message:", error);
        setLocalRealtimeMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === tempId ? { ...msg, isPending: false, error: true } : msg
          );
          setRealtimeMessages(updatedMessages);
          return updatedMessages;
        });
      } finally {
        setIsSending(false);
      }

      scrollToBottom();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (selectedChat && userId) {
      const markAsRead = async () => {
        try {
          const result = await markMessagesAsRead({
            senderId: selectedChat.recipientId,
          });
          if (result.data) {
            setUnreadCount(result.data.newUnreadCount);
            setUnreadCounts((prev) => ({
              ...prev,
              [selectedChat.recipientId]: 0,
            }));
          }
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      markAsRead();
    }
  }, [selectedChat?.recipientId, userId, setUnreadCounts]);

  // Find the last read and last sent message IDs
  const { lastReadMessageId, lastSentMessageId } = (() => {
    // Filter messages sent by the current user, excluding pending or errored messages
    const sentMessages = realtimeMessages
      .filter((msg) => msg.isFromCurrentUser && !msg.isPending && !msg.error)
      .reverse(); // Reverse to start from the newest message

    // Find the last read message
    const lastReadMessage = sentMessages.find((msg) => msg.isRead);
    const lastReadMessageId = lastReadMessage ? lastReadMessage.id : null;

    // Find the last sent message
    const lastSentMessage = sentMessages[0]; // First in reversed array is the newest
    const lastSentMessageId = lastSentMessage ? lastSentMessage.id : null;

    return { lastReadMessageId, lastSentMessageId };
  })();

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Select a conversation to start</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col border-r-2 ${
        showProfile ? "md:w-[calc(100%-20rem)]" : "w-full"
      }`}
    >
      <Card className="flex-1 bg-gray-100 border-none">
        <CardContent className="p-4 h-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Message loading...</p>
              </div>
            </div>
          ) : realtimeMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-2">No message</p>
                <p className="text-sm">Start the conversation by sending a message</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 p-4">
                {realtimeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    ref={(el) => {
                      if (el) messageRefs.current[msg.id] = el;
                    }}
                    className={`flex ${
                      msg.isFromCurrentUser ? "justify-end" : "justify-start"
                    }`}
                    onClick={() => setHighlightedMessageId(null)}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 cursor-pointer ${
                        msg.isFromCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      } ${
                        msg.id === highlightedMessageId
                          ? msg.isFromCurrentUser
                            ? "border-2 border-blue-900"
                            : "border-2 border-gray-700"
                          : ""
                      }`}
                    >
                      {msg.text && <p className="max-w-[600px] break-words">{msg.text}</p>}
                      {msg.filePath && msg.fileType && (
                        <div className="mx-[-9px]">
                          {msg.fileType.startsWith("image/") ? (
                            <Image
                              src={msg.filePath}
                              alt={msg.originalFileName || "Attached image"}
                              width={490}
                              height={490}
                              className="rounded cursor-pointer"
                              onClick={() => setSelectedImage(msg.filePath!)}
                            />
                          ) : (
                            <a
                              href={msg.filePath}
                              download={msg.originalFileName}
                              className="text-blue-300 underline mt-2 mx-[9px] hover:text-black"
                            >
                              {msg.originalFileName || "Download file"}
                            </a>
                          )}
                        </div>
                      )}
                      <div
                        className={`text-xs mt-1 flex items-center ${
                          msg.isFromCurrentUser
                            ? "text-blue-100 justify-end"
                            : "text-gray-500"
                        }`}
                      >
                        <span>{msg.time}</span>
                        {msg.isFromCurrentUser && (
                          <>
                            {msg.isPending && (
                              <span className="ml-2 text-blue-100">
                                {msg.filePath ? "Uploading..." : "Sending..."}
                              </span>
                            )}
                            {!msg.isPending && msg.error && (
                              <span className="ml-2 text-red-300">
                                Failed to send
                              </span>
                            )}
                            {!msg.isPending && !msg.error && (
                              <>
                                {msg.id === lastReadMessageId && msg.isRead && (
                                  <span className="ml-2 flex items-center">
                                    {selectedChat.recipientPhoto ? (
                                      <Image
                                        src={selectedChat.recipientPhoto}
                                        alt="Seen"
                                        width={16}
                                        height={16}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <CheckCheck
                                        size={16}
                                        className="text-blue-100"
                                      />
                                    )}
                                  </span>
                                )}
                                {msg.id === lastSentMessageId && !msg.isRead && (
                                  <span className="ml-2 flex items-center">
                                    <Check
                                      size={16}
                                      className="text-blue-100"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      {selectedFile && (
        <div
          className="absolute bottom-16 p-2 bg-white rounded-lg shadow-lg flex items-center justify-between z-10"
          style={{ transform: "translateY(8px)" }}
        >
          {selectedFile.type.startsWith("image/") ? (
            <div className="flex items-center">
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt={selectedFile.name}
                width={50}
                height={50}
                className="rounded object-cover"
              />
              <span className="ml-2 text-sm text-gray-700">
                {selectedFile.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <FileText size={20} className="text-gray-500" />
              <span className="ml-2 text-sm text-gray-700">
                {selectedFile.name}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-200"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            aria-label="Remove file"
          >
            <X size={20} />
          </Button>
        </div>
      )}
      {selectedImage && (
        <PreviewImage
          src={selectedImage}
          alt="Full-size chat image"
          onClose={() => setSelectedImage(null)}
        />
      )}
      <Card className="bg-white border-t border-none">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
                aria-label="Attach image"
              >
                <ImageIcon size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*";
                    fileInputRef.current.click();
                  }
                }}
                aria-label="Attach file"
              >
                <FileText size={20} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="relative flex-1">
              <Input
                placeholder="Write your message..."
                ref={inputRef}
                value={message}
                className="flex-1 bg-gray-100 border-0 pr-10"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessageHandler();
                  }
                }}
                disabled={isSending}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:bg-gray-200"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Toggle emoji picker"
              >
                <Smile size={20} />
              </Button>
              {showEmojiPicker && (
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>
            <Button
              onClick={onSendMessageHandler}
              className="bg-blue-500 hover:bg-blue-600 rounded-full h-10 w-10 p-0 flex items-center justify-center"
              disabled={!message.trim() && !selectedFile || isSending}
              aria-label="Send message"
            >
              <Send size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversation;