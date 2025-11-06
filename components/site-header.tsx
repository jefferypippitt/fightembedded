import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";

interface SiteHeaderProps {
  title?: string;
}

function ModeToggleSkeleton() {
  return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
}

export function SiteHeader({ title = "Overview" }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<ModeToggleSkeleton />}>
            <ModeToggle />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export function SiteHeaderSkeleton() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="-ml-1 h-9 w-9 rounded-md bg-muted animate-pulse" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggleSkeleton />
        </div>
      </div>
    </header>
  );
}
