import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PrefetchRoutes from "@/components/prefetch-routes";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={null}>
        <PrefetchRoutes />
      </Suspense>
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </main>
      <Suspense fallback={<div className="h-14" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
