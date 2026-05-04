"use client"

import { MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./theme-toggle"

type SubLink = {
  href: string
  title: string
  description: string
}

type MenuSection = {
  label: string
  items: SubLink[]
  wide?: boolean
}

const menuSections: MenuSection[] = [
  {
    label: "Athletes",
    wide: true,
    items: [
      {
        href: "/athletes",
        title: "Active Fighters",
        description: "Browse all active fighters in the UFC.",
      },
      {
        href: "/retired",
        title: "Retired Fighters",
        description: "View hall of fame and retired UFC fighters.",
      },
      {
        href: "/athletes/quick-stats",
        title: "UFC Insights",
        description:
          "Snapshot of standout stats across the organization.",
      },
    ],
  },
  {
    label: "Men's Divisions",
    items: [
      {
        href: "/division/men-heavyweight",
        title: "Heavyweight",
        description: "265 lbs (120.2 kg)",
      },
      {
        href: "/division/men-light-heavyweight",
        title: "Light Heavyweight",
        description: "205 lbs (93.0 kg)",
      },
      {
        href: "/division/men-middleweight",
        title: "Middleweight",
        description: "185 lbs (83.9 kg)",
      },
      {
        href: "/division/men-welterweight",
        title: "Welterweight",
        description: "170 lbs (77.1 kg)",
      },
      {
        href: "/division/men-lightweight",
        title: "Lightweight",
        description: "155 lbs (70.3 kg)",
      },
      {
        href: "/division/men-featherweight",
        title: "Featherweight",
        description: "145 lbs (65.8 kg)",
      },
      {
        href: "/division/men-bantamweight",
        title: "Bantamweight",
        description: "135 lbs (61.2 kg)",
      },
      {
        href: "/division/men-flyweight",
        title: "Flyweight",
        description: "125 lbs (56.7 kg)",
      },
    ],
  },
  {
    label: "Women's Divisions",
    items: [
      {
        href: "/division/women-bantamweight",
        title: "Bantamweight",
        description: "135 lbs (61.2 kg)",
      },
      {
        href: "/division/women-flyweight",
        title: "Flyweight",
        description: "125 lbs (56.7 kg)",
      },
      {
        href: "/division/women-strawweight",
        title: "Strawweight",
        description: "115 lbs (52.2 kg)",
      },
    ],
  },
  {
    label: "Rankings",
    wide: true,
    items: [
      {
        href: "/rankings/popularity",
        title: "Popular Rankings",
        description: "Top 20 athletes by popularity",
      },
      {
        href: "/rankings/divisions",
        title: "Division Rankings",
        description: "Top 5 athletes by division popularity",
      },
      {
        href: "/rankings/all-time",
        title: "All Time Popularity",
        description: "Most popular athletes across all eras",
      },
    ],
  },
]

const directLinks = [
  { href: "/events", label: "Events" },
]

function SectionListItem({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <li>
      <NavigationMenuLink asChild className="gap-0.5 p-1.5">
        <Link href={href}>
          <div className="text-[13px] leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-1 text-xs leading-snug">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="size-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] no-scrollbar sm:w-[300px]"
            >
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Image
                    src="/fightembedded-logo.png"
                    alt="Fight Embedded Logo"
                    width={32}
                    height={32}
                    className="logo-image dark:invert"
                  />
                  <SheetTitle>Fight Embedded</SheetTitle>
                </div>
                <SheetDescription>
                  Browse athletes, divisions, rankings, and events.
                </SheetDescription>
              </SheetHeader>
              <nav className="no-scrollbar overflow-y-auto space-y-4 px-3 pb-5">
                <div>
                  <Link
                    href="/"
                    className="text-foreground text-sm font-semibold hover:underline"
                  >
                    Home
                  </Link>
                </div>
                {menuSections.map((section) => (
                  <div key={section.label} className="space-y-1.5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      {section.label}
                    </p>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex flex-col gap-1 rounded-md border bg-card/50 p-2 text-[13px] leading-5 transition-colors hover:bg-accent hover:no-underline"
                          >
                            <span>{item.title}</span>
                            <span className="text-muted-foreground text-xs">{item.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="pt-1">
                  {directLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image
              src="/fightembedded-logo.png"
              alt="Fight Embedded Logo"
              width={32}
              height={32}
              className="logo-image dark:invert"
            />
            <span className="text-lg tracking-tight">
              Fight Embedded
            </span>
          </Link>

        </div>

        <NavigationMenu viewport={false} className="hidden lg:flex lg:flex-1 lg:justify-center">
          <NavigationMenuList>
            {menuSections.map((section) => (
              <NavigationMenuItem key={section.label}>
                <NavigationMenuTrigger>{section.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "grid gap-1 p-1",
                      section.wide
                        ? "w-[260px] grid-cols-1"
                        : section.items.length > 4
                          ? "w-[300px] grid-cols-2"
                          : "w-[210px] grid-cols-1"
                    )}
                  >
                    {section.items.map((item) => (
                      <SectionListItem
                        key={item.href}
                        href={item.href}
                        title={item.title}
                        description={item.description}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {directLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center justify-self-end">
          <ModeToggle />
        </div>

      </div>
    </header>
  )
}
