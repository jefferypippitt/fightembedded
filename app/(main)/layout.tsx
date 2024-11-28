import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "flex min-h-screen flex-col",
      "bg-background text-foreground",
      "antialiased"
    )}>
      <Navbar />
      <main className={cn(
        "flex-1",
        "container mx-auto",
        "px-4 sm:px-6 lg:px-8",
        "py-4 sm:py-6 lg:py-8",
        "max-w-7xl"
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
