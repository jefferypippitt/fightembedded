import { Suspense } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { DashboardHeader, SiteHeaderSkeleton } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function SidebarUserFooter() {
  return <NavUser />;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        userSlot={
          <Suspense fallback={null}>
            <SidebarUserFooter />
          </Suspense>
        }
      />
      <SidebarInset>
        <Suspense fallback={<SiteHeaderSkeleton />}>
          <DashboardHeader />
        </Suspense>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
