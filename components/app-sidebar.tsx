"use client";

import * as React from "react";
import {
  IconCalendar,
  IconCalendarCog,
  IconLayoutDashboard,
  IconUserPlus,
  IconUserShield,
} from "@tabler/icons-react";

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
      icon: IconLayoutDashboard,
    },
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
