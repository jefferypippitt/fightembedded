import Footer from "@/components/footer";
import Navbar from "@/components/navbar";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}
