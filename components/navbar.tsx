"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { weightClasses, generateDivisionSlug } from "@/data/weight-class";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const divisions = {
  mens: weightClasses.men.map((division) => ({
    title: division.name,
    href: `/division/${generateDivisionSlug(division)}`,
    description: `${division.weight}lbs`,
    key: `mens-${division.name}`,
  })),
  womens: weightClasses.women.map((division) => ({
    title: division.name,
    href: `/division/${generateDivisionSlug(division, true)}`,
    description: `${division.weight}lbs`,
    key: `womens-${division.name}`,
  })),
};

const rankings = [
  {
    title: "Fighter Popularity",
    href: "/rankings/popularity",
    description: "Top 20 Fighters",
  },
  {
    title: "Division Rankings",
    href: "/rankings/divisions",
    description: "Top 5 per Division",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-xs text-muted-foreground mt-1">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <div className={`sticky top-0 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 z-50 border-b ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Fight Embedded Logo"
            width={35}
            height={35}
            className="rounded-sm"
          />
          <h1 className="text-lg font-medium">Fight Embedded</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="h-9">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/athletes"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 bg-transparent hover:bg-transparent focus:bg-transparent"
                    )}
                  >
                    Athletes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/events"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 bg-transparent hover:bg-transparent focus:bg-transparent"
                    )}
                  >
                    Events
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent hover:bg-transparent focus:bg-transparent">
                  Weight Divisions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-2 p-3">
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-1">
                        Men&apos;s Divisions
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-1">
                        {divisions.mens.map((division) => (
                          <ListItem
                            key={division.title}
                            title={division.title}
                            href={division.href}
                            className="p-2"
                          >
                            {division.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-medium text-muted-foreground mb-1">
                        Women&apos;s Divisions
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-1">
                        {divisions.womens.map((division) => (
                          <ListItem
                            key={division.title}
                            title={division.title}
                            href={division.href}
                            className="p-2"
                          >
                            {division.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent hover:bg-transparent focus:bg-transparent">
                  Rankings
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[280px] gap-1 p-3">
                    {rankings.map((ranking) => (
                      <ListItem
                        key={ranking.title}
                        title={ranking.title}
                        href={ranking.href}
                        className="p-2"
                      >
                        {ranking.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/retired"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 bg-transparent hover:bg-transparent focus:bg-transparent"
                    )}
                  >
                    Retired
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="h-9">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <div className="h-9">
            <ModeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="Fight Embedded Logo"
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span className="text-sm">Fight Embedded</span>
              </SheetTitle>
              <nav className="flex flex-col gap-3 mt-4">
                <Link
                  href="/athletes"
                  className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                >
                  Athletes
                </Link>

                <Link
                  href="/events"
                  className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                >
                  Events
                </Link>

                <div className="space-y-2">
                  <h2 className="text-sm font-medium">Weight Divisions</h2>
                  <div className="pl-2 space-y-2">
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-muted-foreground">
                        Men&apos;s
                      </h3>
                      <div className="grid grid-cols-2 gap-1">
                        {divisions.mens.map((division) => (
                          <Link
                            key={division.key}
                            href={division.href}
                            className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                          >
                            <span className="block">{division.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {division.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-muted-foreground">
                        Women&apos;s
                      </h3>
                      <div className="grid grid-cols-2 gap-1">
                        {divisions.womens.map((division) => (
                          <Link
                            key={division.key}
                            href={division.href}
                            className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                          >
                            <span className="block">{division.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {division.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-sm font-medium">Rankings</h2>
                  <div className="pl-2 space-y-2">
                    {rankings.map((ranking) => (
                      <Link
                        key={ranking.title}
                        href={ranking.href}
                        className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                      >
                        <span className="block">{ranking.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {ranking.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/retired"
                  className="block select-none rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
                >
                  Retired
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
} 