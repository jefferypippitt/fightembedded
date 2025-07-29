"use client";

import * as React from "react";
import { ChevronsUpDown, Home, Calendar, User } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconUserShield } from "@tabler/icons-react";

const navigationItems = [
  {
    name: "Homepage",
    url: "/",
    logo: Home,
  },
  {
    name: "Athletes",
    url: "/athletes",
    logo: User,
  },
  {
    name: "Retired",
    url: "/retired",
    logo: IconUserShield,
  },
  {
    name: "Events",
    url: "/events",
    logo: Calendar,
  },
];

export function HomepageSwitcher() {
  const { isMobile } = useSidebar();
  const [activeItem, setActiveItem] = React.useState(navigationItems[0]);

  if (!activeItem) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">FightEmbedded</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
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
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.name}
                asChild
                className="gap-2 p-2 cursor-pointer"
              >
                <Link href={item.url} onClick={() => setActiveItem(item)}>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <item.logo className="size-3.5 shrink-0" />
                  </div>
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
