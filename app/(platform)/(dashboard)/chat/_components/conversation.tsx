/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import { Send, ImageIcon, FileText, Check, CheckCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/send-message";
import { getMessages } from "@/actions/get-messages";
import { UIChat, UIMessage } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUnreadMessageContext } from "@/components/providers/unread-message-provider";
import { markMessagesAsRead } from "@/actions/mark-messages-as-read";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

interface UnreadCounts {
  [senderId: string]: number;
}

interface ConversationProps {
  selectedChat?: UIChat;
  showProfile?: boolean;
  setUnreadCounts: React.Dispatch<React.SetStateAction<UnreadCounts>>;
}

const Conversation = ({
  selectedChat,
  showProfile = false,
  setUnreadCounts,
}: ConversationProps) => {
  const [realtimeMessages, setRealtimeMessages] = useState<UIMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
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
        content: string;
        createdAt: string;
      }) => {
        if (data.senderId === selectedChat.recipientId) {
          const newMessage = {
            id: data.messageId,
            senderId: data.senderId,
            text: data.content,
            time: formatDate(data.createdAt),
            isFromCurrentUser: false,
            isRead: false,
          };
          setRealtimeMessages((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
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
          setRealtimeMessages((prev) =>
            prev.map((msg) =>
              data.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
            )
          );
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
      setRealtimeMessages([]);
      fetchMessages(selectedChat.recipientId).then((formattedMessages) => {
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

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [realtimeMessages]);

  const onSendMessageHandler = async () => {
    if (message.trim() && userId && selectedChat && !isSending) {
      const tempId = `temp-${Date.now()}`;
      const messageText = message.trim();
      const currentTime = formatDate(new Date());

      setIsSending(true);

      const newMessage = {
        id: tempId,
        senderId: userId,
        text: messageText,
        time: currentTime,
        isFromCurrentUser: true,
        isPending: true,
        isRead: false,
      };

      setRealtimeMessages((prev) => [...prev, newMessage]);
      setMessage("");

      try {
        const result = await sendMessage({
          recipientId: selectedChat.recipientId,
          content: messageText,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const serverMessage = result.data?.message;
        setRealtimeMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  id: serverMessage?.id ?? tempId,
                  isPending: false,
                  isRead: serverMessage?.isRead ?? false,
                }
              : msg
          )
        );
      } catch (error) {
        console.error("Error sending message:", error);
        setRealtimeMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, isPending: false, error: true } : msg
          )
        );
      } finally {
        setIsSending(false);
      }

      scrollToBottom();
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

  const lastSentMessageIndex = realtimeMessages
    .slice()
    .reverse()
    .findIndex(
      (msg) => msg.isFromCurrentUser && !msg.isPending && !msg.error
    );
  const lastSentMessageId =
    lastSentMessageIndex !== -1
      ? realtimeMessages[realtimeMessages.length - 1 - lastSentMessageIndex].id
      : null;

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${
        showProfile ? "md:w-[calc(100%-20rem)]" : "w-full"
      }`}
    >
      <Card className="flex-1 bg-gray-50 border-none">
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
                    className={`flex ${
                      msg.isFromCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.isFromCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
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
                                Sending...
                              </span>
                            )}
                            {!msg.isPending && msg.error && (
                              <span className="ml-2 text-red-300">
                                Failed to send
                              </span>
                            )}
                            {!msg.isPending &&
                              !msg.error &&
                              msg.id === lastSentMessageId && (
                                <span className="ml-2 flex items-center">
                                  {msg.isRead ? (
                                    selectedChat.recipientPhoto ? (
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
                                    )
                                  ) : (
                                    <Check
                                      size={16}
                                      className="text-blue-100"
                                    />
                                  )}
                                </span>
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
      <Card className="bg-white border-t border-none">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100"
                aria-label="Attach image"
              >
                <ImageIcon size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100"
                aria-label="Attach file"
              >
                <FileText size={20} />
              </Button>
            </div>
            <Input
              placeholder="Write your message..."
              value={message}
              className="flex-1 bg-gray-100 border-0"
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
              onClick={onSendMessageHandler}
              className="bg-blue-500 hover:bg-blue-600 rounded-full h-10 w-10 p-0 flex items-center justify-center"
              disabled={!message.trim() || isSending}
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