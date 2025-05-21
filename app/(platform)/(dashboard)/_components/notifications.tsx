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
import { markNotificationAsRead } from "@/actions/mark-notification-as-read";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/components/providers/notification-provider";
import { toast } from "sonner";
import { Notification } from "@prisma/client";

const Notifications = () => {
  const { notifications } = useNotifications();
  const [boardIdMap, setBoardIdMap] = useState<{ [cardId: string]: string }>({});
  const router = useRouter();

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
    const result = await markNotificationAsRead({ notificationId: notification.id });
    if (result.data?.success) {
      const boardId = boardIdMap[notification.cardId!] || notification.cardId;
      router.push(`/board/${boardId}`);
    } else {
      toast.error(result.error || "Failed to mark notification as read");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="custom_ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-transparent bg-transparent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-current" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[640px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {notifications.length > 0 ? (
          notifications
            .filter((n) => n.cardId)
            .map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => handleNotificationClick(notification)}
                className={`
                  flex flex-col items-start px-4 py-3 mb-1 rounded-lg
                  ${
                    notification.isRead
                      ? "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      : "bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100"
                  }
                  hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600
                  transition-all duration-200 cursor-pointer
                `}
              >
                <span className="text-sm font-medium truncate w-full">
                  {notification.message}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </DropdownMenuItem>
            ))
        ) : (
          <DropdownMenuItem className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
