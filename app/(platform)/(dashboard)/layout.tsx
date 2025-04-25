import { getFavorites } from "@/actions/get-favorites";
import { Navbar } from "./_components/navbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { data, error } = await getFavorites({});

  if (error || !data) {
    return <div>Error: {error || "No favorites data"}</div>;
  }

  return (
    <div className="h-full">
      <Navbar favorites={data.favorites} />
      <div className="bg-gray-100 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
