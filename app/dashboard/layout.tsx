import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { DashboardHeader, SiteHeaderSkeleton } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Server Component that fetches user data for sidebar footer (runtime data requires Suspense)
async function SidebarUserFooter() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userData = {
    name: session.user.name || session.user.email.split("@")[0],
    email: session.user.email,
    avatar: session.user.image || "",
    initials: getInitials(
      session.user.name || session.user.email.split("@")[0]
    ),
  };

  return <NavUser user={userData} />;
}

// Server Component that checks auth and renders children (runtime data requires Suspense)
async function AuthenticatedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Static sidebar structure renders immediately */}
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
        {/* Auth check for children */}
        <Suspense fallback={null}>
          <AuthenticatedContent>{children}</AuthenticatedContent>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
