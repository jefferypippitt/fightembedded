"use client";

import * as React from "react";
import {
  Calendar,
  CalendarCog,
  LayoutDashboard,
  UserPlus,
  UserCog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavManagement } from "./nav-management";
import { HomepageSwitcher } from "./homepage-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userSlot?: React.ReactNode;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Create Athlete",
      url: "/dashboard/athletes/new",
      icon: UserPlus,
    },
    {
      title: "Create Event",
      url: "/dashboard/events/new",
      icon: Calendar,
    },
  ],
  management: [
    {
      name: "Manage Athletes",
      url: "/dashboard/athletes",
      icon: UserCog,
    },
    {
      name: "Manage Events",
      url: "/dashboard/events",
      icon: CalendarCog,
    },
  ],
};

export function AppSidebar({ userSlot, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <HomepageSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>{userSlot}</SidebarFooter>
    </Sidebar>
  );
}
