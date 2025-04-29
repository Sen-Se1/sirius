"use server";

import { getFavorites } from "@/actions/get-favorites";
import { getNotifications } from "@/actions/get-notifications";
import { Navbar } from "./_components/navbar";
import { UnreadMessageProvider } from "@/components/providers/unread-message-provider";
import { getUnreadMessageCount } from "@/actions/get-unread-message-count";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const favoritesResult = await getFavorites({});
  const notificationsResult = await getNotifications({});
  const unreadCountResult = await getUnreadMessageCount({});

  if (favoritesResult.error || !favoritesResult.data) {
    return <div>Error: {favoritesResult.error || "No favorites data"}</div>;
  }

  if (notificationsResult.error || !notificationsResult.data) {
    return (
      <div>Error: {notificationsResult.error || "No notifications data"}</div>
    );
  }
  const initialUnreadCount = unreadCountResult.data?.count || 0;

  return (
    <UnreadMessageProvider initialCount={initialUnreadCount}>
      <div className="h-full">
        <Navbar
          favorites={favoritesResult.data.favorites}
          notifications={notificationsResult.data.notifications}
        />
        <div className="bg-gray-100 h-full">{children}</div>
      </div>
    </UnreadMessageProvider>
  );
};

export default DashboardLayout;
