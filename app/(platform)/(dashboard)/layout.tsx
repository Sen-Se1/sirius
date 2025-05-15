"use server";

import { getFavorites } from "@/actions/get-favorites";
import { getNotifications } from "@/actions/get-notifications";
import { Navbar } from "./_components/navbar";
import { UnreadMessagePollingProvider } from "@/components/providers/unread-message-polling-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { getUnreadMessageCount } from "@/actions/get-unread-message-count";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const favoritesResult = await getFavorites({});
  const notificationsResult = await getNotifications({});
  const unreadCountResult = await getUnreadMessageCount({});

  if (favoritesResult.error || !favoritesResult.data) {
    return <div>Error: {favoritesResult.error || "No favorites data"}</div>;
  }

  if (notificationsResult.error || !notificationsResult.data) {
    return <div>Error: {notificationsResult.error || "No notifications data"}</div>;
  }

  const initialUnreadCount = unreadCountResult.data?.count || 0;
  const initialNotifications = notificationsResult.data.notifications;

  return (
    <UnreadMessagePollingProvider initialCount={initialUnreadCount}>
      <NotificationProvider initialNotifications={initialNotifications}>
        <div className="h-full flex flex-col">
          <Navbar favorites={favoritesResult.data.favorites} />
          <div className="bg-gray-100 flex-1">{children}</div>
        </div>
      </NotificationProvider>
    </UnreadMessagePollingProvider>
  );
};

export default DashboardLayout;