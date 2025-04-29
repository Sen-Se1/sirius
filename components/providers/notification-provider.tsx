"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@clerk/nextjs";
import { Notification } from "@prisma/client";

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  setNotifications: () => {},
});

export function NotificationProvider({
  children,
  initialNotifications,
}: {
  children: React.ReactNode;
  initialNotifications: Notification[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`notifications-${userId}`);

    channel.bind("new-notification", (data: Notification) => {
      console.log("New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    channel.bind("notification-updated", (data: { id: string; isRead: boolean }) => {
      console.log("Notification updated:", data);
      setNotifications((prev) =>
        prev.map((n) => (n.id === data.id ? { ...n, isRead: data.isRead } : n))
      );
    });

    channel.bind("notification-deleted", (data: { id: string }) => {
      console.log("Notification deleted:", data);
      setNotifications((prev) => prev.filter((n) => n.id !== data.id));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);