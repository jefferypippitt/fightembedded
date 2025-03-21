import { User2, ChevronUp, Users, Calendar } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SignOutButton } from "@/components/sign-out-button";

interface AppSidebarProps {
  user: {
    name?: string | null;

    email?: string | null;
  };
}

const favorites = [
  {
    name: "Dashboard Overview",

    url: "/dashboard",

    emoji: "🏠",
  },

  {
    name: "Create Athlete",

    url: "/dashboard/athletes/new",

    emoji: "🏋️",
  },

  {
    name: "Create Event",

    url: "/dashboard/events/new",

    emoji: "📅",
  },

  {
    name: "Back to Fight Embedded",

    url: "/",

    emoji: "🔙",
  },
];

const management = [
  {
    name: "Manage Athletes",

    url: "/dashboard/athletes",

    icon: Users,

    description: "Add, edit, or remove athletes",
  },
  {
    name: "Manage Events",
    url: "/dashboard/events",
    icon: Calendar,
    description: "Add, edit, or remove events",
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Fight Embedded</SidebarGroupLabel>

          <SidebarMenu>
            {favorites.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url} title={item.name}>
                    <span>{item.emoji}</span>

                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>

          <SidebarMenu>
            {management.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url} title={item.name}>
                    <item.icon className="h-4 w-4" />

                    <span className="ml-2">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center px-3 py-2">
                <ModeToggle />
                <span className="ml-2">Theme</span>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <User2 className="h-4 w-4" />

                  <span className="ml-2">Admin Account</span>

                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>

                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
