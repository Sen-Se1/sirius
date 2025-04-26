"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Notification {
  id: string;
  userId: string;
  senderId?: string;
  orgId?: string;
  message: string;
  isRead: boolean;
  cardId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications = ({ notifications }: NotificationsProps) => {
    console.log(notifications)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              asChild
              className={`px-3 py-2 text-sm ${
                notification.isRead
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-gray-100"
              } rounded-md focus:outline-none cursor-pointer transition-colors`}
            >
              {notification.cardId ? (
                <Link
                  href={`/board/${notification.cardId}`}
                  className="block w-full h-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  <span className="truncate">{notification.message}</span>
                </Link>
              ) : (
                <Link
                  href={`/chat/${notification.senderId || ''}`}
                  className="block w-full h-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                >
                  <span className="truncate">{notification.message}</span>
                </Link>
              )}
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