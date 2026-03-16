import { Suspense } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { DashboardHeader, SiteHeaderSkeleton } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { connection } from "next/server";

function DashboardLayoutFallback() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderSkeleton />
    </div>
  );
}

function SidebarUserFooter() {
  return <NavUser />;
}

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  // Authentication is handled by proxy.ts middleware which runs before this layout
  // No need to check auth here as unauthenticated users are already redirected

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        userSlot={<SidebarUserFooter />}
      />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutFallback />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
