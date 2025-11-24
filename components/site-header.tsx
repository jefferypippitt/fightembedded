"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";

function getTitleFromPathname(pathname: string): string {
  // Remove leading /dashboard and split
  const segments = pathname
    .replace(/^\/dashboard/, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return "Dashboard Overview";
  }

  const [first, second, third] = segments;

  // Map routes to titles
  if (first === "athletes") {
    if (third === "edit") {
      return "Edit Athlete";
    }
    if (second === "new") {
      return "Add New Athlete";
    }
    return "Athletes";
  }

  if (first === "events") {
    if (third === "edit") {
      return "Edit Event";
    }
    if (second === "new") {
      return "Create Event";
    }
    return "Events";
  }

  // Fallback: capitalize first segment
  return first.charAt(0).toUpperCase() + first.slice(1).replace(/-/g, " ");
}

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteHeaderSkeleton() {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="-ml-1 h-9 w-9 rounded-md bg-muted animate-pulse" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
        <div className="ml-auto flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </header>
  );
}
