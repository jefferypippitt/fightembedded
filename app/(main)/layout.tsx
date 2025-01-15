import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        "bg-background text-foreground",
        "antialiased w-full"
      )}
    >
      <Navbar />
      <main
        className={cn(
          "flex-1 w-full",
          "container mx-auto",
          "px-2 sm:px-4 md:px-6 lg:px-8",
          "py-2 sm:py-4 md:py-6 lg:py-8",
          "max-w-7xl",
          "overflow-hidden"
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
