import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="bg-gray-100 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
