"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDatabase,
  IconListDetails,
  IconReport,

} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavManagement } from "./nav-management"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    image?: string | null
  } | null
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const data = {
  navMain: [
    {
      title: "Create Athlete",
      url: "/dashboard/athletes/new",
      icon: IconListDetails,
    },
    {
      title: "Create Event",
      url: "/dashboard/events/new",
      icon: IconChartBar,
    },
  ],
  management: [
    {
      name: "Manage Athletes",
      url: "/dashboard/athletes",
      icon: IconDatabase,
    },
    {
      name: "Manage Events",
      url: "/dashboard/events",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userData = user ? {
    name: user.name || 'Anonymous',
    email: user.email,
    avatar: user.image || '/avatars/default.jpg',
    initials: getInitials(user.name || 'Anonymous')
  } : null

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <span className="text-base font-semibold">FightEmbedded</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser user={{ ...userData, initials: userData.initials }} />}
      </SidebarFooter>
    </Sidebar>
  )
}
