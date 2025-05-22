"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUnreadMessageCount } from "@/actions/get-unread-message-count";
import { useAuth } from "@clerk/nextjs";

interface UnreadMessageContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const UnreadMessageContext = createContext<UnreadMessageContextType>({
  unreadCount: 0,
  setUnreadCount: (count: number) => {},
});

interface UnreadMessagePollingProviderProps {
  children: React.ReactNode;
  initialCount: number;
}

export const UnreadMessagePollingProvider = ({
  children,
  initialCount,
}: UnreadMessagePollingProviderProps) => {
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    // Poll every 1 seconds
    const pollInterval = setInterval(async () => {
      try {
        const result = await getUnreadMessageCount({});
        if (result.data) {
          setUnreadCount(result.data.count);
        } else {
          console.error("Failed to fetch unread count:", result.error);
        }
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, 1000000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [userId, isLoaded]);

  return (
    <UnreadMessageContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessageContext.Provider>
  );
};

export const useUnreadMessageContext = (): UnreadMessageContextType =>
  useContext(UnreadMessageContext);
