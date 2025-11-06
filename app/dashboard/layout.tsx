import { Suspense, cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { SiteHeaderSkeleton } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

const getSession = cache(async () => {
  const requestHeaders = await headers();
  return auth.api.getSession({
    headers: requestHeaders,
  });
});

function DashboardLayoutFallback() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6">
          <SiteHeaderSkeleton />
          <div className="flex flex-1 items-center justify-center px-4 py-4 lg:px-6 lg:py-6">
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20">
              <LoadingSpinner text="Loading dashboard content..." />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={session.user} />
      <SidebarInset>{children}</SidebarInset>
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
