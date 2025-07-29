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
import { NavUser } from "@/components/nav-user";
import { NavManagement } from "./nav-management";
import { HomepageSwitcher } from "./homepage-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

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
        <HomepageSwitcher />
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
