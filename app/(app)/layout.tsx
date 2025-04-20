import { Toaster } from "sonner";
import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster />
      <main className="flex-grow pt-[62px]">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
