"use server";

import { getFavorites } from "@/actions/get-favorites";
import { getNotifications } from "@/actions/get-notifications";
import { Navbar } from "./_components/navbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const favoritesResult = await getFavorites({});
  const notificationsResult = await getNotifications({});

  if (favoritesResult.error || !favoritesResult.data) {
    return <div>Error: {favoritesResult.error || "No favorites data"}</div>;
  }

  if (notificationsResult.error || !notificationsResult.data) {
    return <div>Error: {notificationsResult.error || "No notifications data"}</div>;
  }

  return (
    <div className="h-full">
    <Navbar
        favorites={favoritesResult.data.favorites}
        notifications={notificationsResult.data.notifications}
      />
      <div className="bg-gray-100 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
