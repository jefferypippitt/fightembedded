import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {children}
        </div>
      </main>
      <Suspense fallback={<div className="h-14" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
