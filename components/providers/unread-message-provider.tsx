"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@clerk/nextjs";

interface UnreadMessageContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const UnreadMessageContext = createContext<UnreadMessageContextType>({
  unreadCount: 0,
  setUnreadCount: (count: number) => {},
});

interface UnreadMessageProviderProps {
  children: React.ReactNode;
  initialCount: number;
}

export const UnreadMessageProvider = ({ children, initialCount }: UnreadMessageProviderProps) => {
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-message", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unbind("new-message");
    };
  }, [userId]);

  return (
    <UnreadMessageContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessageContext.Provider>
  );
};

export const useUnreadMessageContext = (): UnreadMessageContextType =>
  useContext(UnreadMessageContext);