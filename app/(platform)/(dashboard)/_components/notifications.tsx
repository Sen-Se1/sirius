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
          className="relative h-8 w-8 rounded-full hover:bg-transparent bg-transparent"
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
        className="w-96 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        {notifications.length > 0 ? (
          notifications
            .filter((n) => n.cardId)
            .map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => handleNotificationClick(notification)}
                className={`px-3 py-2 text-sm ${
                  notification.isRead
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                } rounded-md focus:outline-none cursor-pointer transition-colors`}
              >
                <span className="truncate">{notification.message}</span>
              </DropdownMenuItem>
            ))
        ) : (
          <DropdownMenuItem className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-default select-none">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;