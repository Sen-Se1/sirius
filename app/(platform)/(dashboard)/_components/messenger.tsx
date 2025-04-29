"use client";

import { useUnreadMessageContext } from "@/components/providers/unread-message-provider";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export const Messenger = () => {
  const { unreadCount } = useUnreadMessageContext();

  return (
    <div className="relative">
      <Link href="/chat" className="focus:outline-none" aria-label="Chat">
        <MessageCircle size={24} className="text-current" />
      </Link>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
      )}
    </div>
  );
};