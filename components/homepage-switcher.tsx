"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    name: "Homepage",
    url: "/",
  },
  {
    name: "Athletes",
    url: "/athletes",
  },
  {
    name: "Retired",
    url: "/retired",
  },
  {
    name: "Events",
    url: "/events",
  },
];

export function HomepageSwitcher() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = React.useState(navigationItems[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center overflow-hidden">
                <Image
                  src="/fightembedded-logo.png"
                  alt="FightEmbedded Logo"
                  width={32}
                  height={32}
                  className="object-contain dark:invert"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">FightEmbedded</span>
                <span className="">{selectedItem.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onSelect={() => {
                  setSelectedItem(item);
                  router.push(item.url);
                }}
              >
                {item.name}{" "}
                {item.name === selectedItem.name && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
