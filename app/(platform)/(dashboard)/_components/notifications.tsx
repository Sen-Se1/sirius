"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Notification } from "@/types";

interface NotificationsProps {
    notifications: Notification[];
}

const Notifications = ({ notifications }: NotificationsProps) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition duration-200"
                >
                    <Bell className="h-5 w-5 text-gray-900 dark:text-white" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
                <DropdownMenuItem className="font-semibold hover:bg-gray-100 dark:hover:bg-gray-700">
                    Notifications
                </DropdownMenuItem>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${!notification.isRead ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {notification.message}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem className="text-gray-500 dark:text-gray-400">
                        Aucune notification
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notifications;