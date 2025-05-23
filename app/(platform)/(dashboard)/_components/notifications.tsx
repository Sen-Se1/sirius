/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBoardIdFromCard } from "@/actions/get-board-id-from-card";
import { markAllNotificationsAsRead } from "@/actions/mark-all-notifications-as-read";
import { markNotificationAsRead } from "@/actions/mark-notification-as-read";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/components/providers/notification-provider";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { Notification } from "@prisma/client";

interface NotificationsProps {
  bgColor: string;
  textColor: string;
}

const Notifications = ({ bgColor, textColor }: NotificationsProps) => {
  const { notifications, setNotifications } = useNotifications();
  const [boardIdMap, setBoardIdMap] = useState<{ [cardId: string]: string }>({});
  const router = useRouter();
  const dropdownBgColor = textColor === "black" ? "#ffffff" : "#1a1a1a";

  const { execute: markAllAsRead, isLoading: isMarkingAll } = useAction(markAllNotificationsAsRead, {
    onSuccess: () => {
      console.log("Marked all notifications as read");
      toast.success("All notifications marked as read");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
      toast.error(error || "Failed to mark all notifications as read");
    },
    onComplete: () => {
      console.log("Mark all notifications action completed");
    },
  });

  const { execute: markAsRead, isLoading: isMarking } = useAction(markNotificationAsRead, {
    onSuccess: (data) => {
      console.log("Marked notification as read:", data);
      toast.success("Notification marked as read");
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast.error(error || "Failed to mark notification as read");
    },
    onComplete: () => {
      console.log("Mark notification action completed");
    },
  });

  useEffect(() => {
    const fetchBoardIds = async () => {
      const cardNotifications = notifications.filter((n) => n.cardId);
      const newBoardIdMap: { [cardId: string]: string } = {};

      for (const notification of cardNotifications) {
        if (notification.cardId && !boardIdMap[notification.cardId]) {
          const result = await getBoardIdFromCard({ cardId: notification.cardId });
          if (result.data && result.data.boardId) {
            newBoardIdMap[notification.cardId] = result.data.boardId;
          } else {
            toast.error("Failed to load board for notification");
          }
        }
      }
      setBoardIdMap((prev) => ({ ...prev, ...newBoardIdMap }));
    };

    fetchBoardIds();
  }, [notifications]);

  const handleNotificationClick = async (notification: Notification) => {
    console.log("Notification clicked:", notification.id);
    await markAsRead({ notificationId: notification.id });
    if (!isMarking) {
      const boardId = boardIdMap[notification.cardId!] || notification.cardId;
      console.log("Navigating to board:", boardId);
      router.push(`/board/${boardId}`);
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read clicked");
    markAllAsRead({});
  };

  const getNotificationClasses = (isRead: boolean) => {
    const baseClasses = [
      "group flex flex-col gap-1 pl-2 py-3 text-sm rounded-lg min-h-16 items-start text-left my-2",
      "hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-150 ease-in-out hover:scale-[1.02]",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer",
    ];
    const conditionalClasses = textColor === "black"
      ? isRead
        ? ["bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"]
        : ["bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100"]
      : isRead
        ? ["bg-gray-700 text-gray-300 dark:text-gray-400"]
        : ["bg-blue-900 text-gray-100 dark:text-gray-200"];
    return [...baseClasses, ...conditionalClasses].join(" ");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="custom_ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-transparent bg-transparent"
          aria-label="Notifications"
          style={{ color: textColor }}
        >
          <Bell className="h-5 w-5 text-current" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[640px] max-h-96 overflow-y-auto z-[1000] rounded-xl shadow-2xl border border-gray-200 bg-opacity-95 transition-all duration-200 ease-in-out transform animate-fadeIn dark:border-gray-700 text-left"
        style={{ backgroundColor: dropdownBgColor, color: textColor }}
      >
        {notifications.length > 0 ? (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll || !notifications.some((n) => !n.isRead)}
                className={`text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors ${
                  isMarkingAll || !notifications.some((n) => !n.isRead)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Mark all as read
              </button>
            </div>
            {notifications
              .filter((n) => n.cardId)
              .map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onSelect={() => handleNotificationClick(notification)}
                  className={getNotificationClasses(notification.isRead)}
                >
                  <span className="font-medium break-words text-left">{notification.message}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 break-words text-left">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </DropdownMenuItem>
              ))}
          </div>
        ) : (
          <DropdownMenuItem className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none text-left">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;