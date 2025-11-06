"use client";

import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "./theme-toggle";
import Image from "next/image";
import PrefetchLink from "@/components/prefetch-link";
import { useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  {
    label: "Athletes",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/athletes",
        label: "Active Fighters",
        description: "Browse all active fighters in the UFC.",
      },
      {
        href: "/retired",
        label: "Retired Fighters",
        description: "View the hall of fame and retired fighters in the UFC.",
      },
    ],
  },
  {
    label: "Men's Divisions",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/division/men-heavyweight",
        label: "Heavyweight",
        description: "265 lbs (120.2 kg)",
      },
      {
        href: "/division/men-light-heavyweight",
        label: "Light Heavyweight",
        description: "205 lbs (93.0 kg)",
      },
      {
        href: "/division/men-middleweight",
        label: "Middleweight",
        description: "185 lbs (83.9 kg)",
      },
      {
        href: "/division/men-welterweight",
        label: "Welterweight",
        description: "170 lbs (77.1 kg)",
      },
      {
        href: "/division/men-lightweight",
        label: "Lightweight",
        description: "155 lbs (70.3 kg)",
      },
      {
        href: "/division/men-featherweight",
        label: "Featherweight",
        description: "145 lbs (65.8 kg)",
      },
      {
        href: "/division/men-bantamweight",
        label: "Bantamweight",
        description: "135 lbs (61.2 kg)",
      },
      {
        href: "/division/men-flyweight",
        label: "Flyweight",
        description: "125 lbs (56.7 kg)",
      },
    ],
  },
  {
    label: "Women's Divisions",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/division/women-bantamweight",
        label: "Bantamweight",
        description: "135 lbs (61.2 kg)",
      },
      {
        href: "/division/women-flyweight",
        label: "Flyweight",
        description: "125 lbs (56.7 kg)",
      },
      {
        href: "/division/women-strawweight",
        label: "Strawweight",
        description: "115 lbs (52.2 kg)",
      },
    ],
  },
  {
    label: "Rankings",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/rankings/popularity",
        label: "Popular Rankings",
        description: "Top 20 athletes by popularity",
      },
      {
        href: "/rankings/divisions",
        label: "Popular Division Rankings",
        description: "Top 5 athletes by division popularity",
      },
    ],
  },
  { href: "/events", label: "Events" },
];

export default function Navbar() {
  const router = useRouter();
  const prefetchedSet = useRef(new Set<string>());

  const prefetchRoute = useCallback(
    (href?: string | null) => {
      if (!href) return;
      if (prefetchedSet.current.has(href)) return;

      prefetchedSet.current.add(href);

      try {
        const maybePromise = router.prefetch(href);
        void Promise.resolve(maybePromise).catch(() => {
          prefetchedSet.current.delete(href);
        });
      } catch {
        prefetchedSet.current.delete(href);
      }
    },
    [router]
  );

  const prefetchGroup = useCallback(
    (hrefs: Array<string | undefined>) => {
      hrefs.forEach((href) => prefetchRoute(href));
    },
    [prefetchRoute]
  );

  const navigationLinksWithPrefetchTargets = useMemo(() => {
    return navigationLinks.map((link) => {
      if (!link.submenu) {
        return {
          ...link,
          prefetchTargets: link.href ? [link.href] : [],
        };
      }

      const targets =
        link.items?.map((item) => item.href ?? "").filter(Boolean) ?? [];
      return {
        ...link,
        prefetchTargets: targets,
      };
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group size-8 md:hidden"
                  variant="ghost"
                  size="icon"
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        {link.submenu ? (
                          <>
                            <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                              {link.label}
                            </div>
                            <ul>
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink asChild>
                                    <PrefetchLink
                                      href={item.href || "#"}
                                      className="py-1.5"
                                    >
                                      {item.label}
                                    </PrefetchLink>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <NavigationMenuLink asChild>
                            <PrefetchLink
                              href={link.href || "#"}
                              className="text-muted-foreground hover:text-primary px-2 py-1.5 font-medium"
                            >
                              {link.label}
                            </PrefetchLink>
                          </NavigationMenuLink>
                        )}
                        {/* Add separator between different types of items */}
                        {index < navigationLinks.length - 1 &&
                          // Show separator if:
                          // 1. One is submenu and one is simple link OR
                          // 2. Both are submenus but with different types
                          ((!link.submenu &&
                            navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              !navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              navigationLinks[index + 1].submenu &&
                              link.type !==
                                navigationLinks[index + 1].type)) && (
                            <div
                              role="separator"
                              aria-orientation="horizontal"
                              className="bg-border -mx-1 my-1 h-px w-full"
                            />
                          )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <PrefetchLink href="/" className="flex items-center gap-2">
                <Image
                  src="/fightembedded-logo.png"
                  alt="Fight Embedded Logo"
                  width={40}
                  height={40}
                  className="logo-image dark:invert"
                />
                <h1 className="text-lg font-medium tracking-tighter">
                  Fight Embedded
                </h1>
              </PrefetchLink>
              {/* Navigation menu */}
              <NavigationMenu viewport={false} className="max-md:hidden">
                <NavigationMenuList className="gap-2">
                  {navigationLinksWithPrefetchTargets.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      {link.submenu ? (
                        <>
                          <NavigationMenuTrigger
                            className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5"
                            onPointerEnter={() =>
                              prefetchGroup(link.prefetchTargets)
                            }
                            onFocus={() => prefetchGroup(link.prefetchTargets)}
                          >
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                            <ul
                              className={cn(
                                link.type === "description"
                                  ? "min-w-64"
                                  : "min-w-48"
                              )}
                            >
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink asChild>
                                    <PrefetchLink
                                      href={item.href || "#"}
                                      className="text-muted-foreground hover:text-primary px-2 py-1.5 font-medium"
                                    >
                                      {/* Display icon if present */}
                                      {link.type === "icon" &&
                                        "icon" in item && (
                                          <div className="flex items-center gap-2">
                                            {item.icon === "BookOpenIcon" && (
                                              <BookOpenIcon
                                                size={16}
                                                className="text-foreground opacity-60"
                                                aria-hidden="true"
                                              />
                                            )}
                                            {item.icon === "LifeBuoyIcon" && (
                                              <LifeBuoyIcon
                                                size={16}
                                                className="text-foreground opacity-60"
                                                aria-hidden="true"
                                              />
                                            )}
                                            {item.icon === "InfoIcon" && (
                                              <InfoIcon
                                                size={16}
                                                className="text-foreground opacity-60"
                                                aria-hidden="true"
                                              />
                                            )}
                                            <span>{item.label}</span>
                                          </div>
                                        )}

                                      {/* Display label with description if present */}
                                      {link.type === "description" &&
                                      "description" in item ? (
                                        <div className="space-y-1">
                                          <div className="font-medium">
                                            {item.label}
                                          </div>
                                          <p className="text-muted-foreground line-clamp-2 text-xs">
                                            {item.description}
                                          </p>
                                        </div>
                                      ) : (
                                        // Display simple label if not icon or description type
                                        !link.type ||
                                        (link.type !== "icon" &&
                                          link.type !== "description" && (
                                            <span>{item.label}</span>
                                          ))
                                      )}
                                    </PrefetchLink>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <PrefetchLink
                            href={link.href || "#"}
                            className="text-muted-foreground hover:text-primary px-2 py-1.5 font-medium"
                          >
                            {link.label}
                          </PrefetchLink>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
