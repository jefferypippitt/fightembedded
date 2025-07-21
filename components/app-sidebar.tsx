"use client";

import * as React from "react";
import {
  IconCalendar,
  IconCalendarCog,
  IconCalendarWeek,
  IconDashboard,
  IconHome,
  IconSelector,
  IconUserPlus,
  IconUserShield,
} from "@tabler/icons-react";

import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavManagement } from "./nav-management";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const data = {
  navMain: [
    {
      title: "Create Athlete",
      url: "/dashboard/athletes/new",
      icon: IconUserPlus,
    },
    {
      title: "Create Event",
      url: "/dashboard/events/new",
      icon: IconCalendar,
    },
  ],
  management: [
    {
      name: "Manage Athletes",
      url: "/dashboard/athletes",
      icon: IconUserShield,
    },
    {
      name: "Manage Events",
      url: "/dashboard/events",
      icon: IconCalendarCog,
    },
  ],
};

function HomeSwitcher() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                <IconDashboard className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">FightEmbedded</span>
              </div>
              <IconSelector className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Navigation
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link href="/">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <IconHome className="size-3.5 shrink-0" />
                </div>
                <div className="font-medium">Homepage</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link href="/events">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <IconCalendarWeek className="size-3.5 shrink-0" />
                </div>
                <div className="font-medium">Events</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userData = user
    ? {
        name: user.name || user.email.split("@")[0],
        email: user.email,
        avatar: user.image || "",
        initials: getInitials(user.name || user.email.split("@")[0]),
      }
    : null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <HomeSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>
        {userData && (
          <NavUser user={{ ...userData, initials: userData.initials }} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
