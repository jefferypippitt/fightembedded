"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { weightClasses, generateDivisionSlug } from "@/data/weight-class";
import { useState } from "react";

export default function Navbar() {
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);
  const [isRankingsDropdownOpen, setIsRankingsDropdownOpen] = useState(false);

  const handleLinkClick = () => {
    setIsWeightDropdownOpen(false);
    setIsRankingsDropdownOpen(false);
  };

  const rankings = [
    {
      name: "Fighter Popularity",
      suffix: "(Top 20)",
      href: "/rankings/popularity",
    },
    {
      name: "Division Rankings",
      suffix: "(Top 5)",
      href: "/rankings/divisions",
    },
  ];

  return (
    <div className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-14 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/fight-embedded-bw.jpg"
            alt="Fight Embedded Logo"
            width={35}
            height={35}
            className="rounded-sm"
          />
          <h1 className="text-lg font-medium">Fight Embedded</h1>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/athletes"
              className="text-sm font-medium hover:text-primary"
            >
              Athletes
            </Link>

            {/* Weight Divisions Dropdown */}
            <DropdownMenu
              open={isWeightDropdownOpen}
              onOpenChange={setIsWeightDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium gap-2">
                  Weight Divisions <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Men&apos;s Divisions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Men&apos;s
                  </h3>
                  {weightClasses.men.map((division) => (
                    <Link
                      key={division.name}
                      href={`/division/${generateDivisionSlug(division)}`}
                      className="block text-sm hover:text-primary"
                      onClick={handleLinkClick}
                    >
                      {division.name}{" "}
                      <span className="text-muted-foreground text-xs">
                        ({division.weight} lbs)
                      </span>
                    </Link>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Women&apos;s Divisions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Women&apos;s
                  </h3>
                  {weightClasses.women.map((division) => (
                    <Link
                      key={division.name}
                      href={`/division/${generateDivisionSlug(division, true)}`}
                      className="block text-sm hover:text-primary"
                      onClick={handleLinkClick}
                    >
                      {division.name}{" "}
                      <span className="text-muted-foreground text-xs">
                        ({division.weight} lbs)
                      </span>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Rankings Dropdown */}
            <DropdownMenu
              open={isRankingsDropdownOpen}
              onOpenChange={setIsRankingsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium gap-2">
                  Rankings <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {rankings.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} onClick={handleLinkClick}>
                      {item.name}{" "}
                      <span className="text-muted-foreground text-xs">
                        {item.suffix}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav
                  className="flex flex-col gap-6"
                  aria-label="Mobile navigation"
                >
                  <Link
                    href="/athletes"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Athletes
                  </Link>

                  {/* Mobile Weight Divisions */}
                  <div className="space-y-3">
                    <h2 className="text-sm font-medium">Weight Divisions</h2>
                    <div className="pl-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Men&apos;s
                        </h3>
                        {weightClasses.men.map((division) => (
                          <Link
                            key={division.name}
                            href={`/division/${generateDivisionSlug(division)}`}
                            className="block text-sm hover:text-primary"
                          >
                            {division.name}{" "}
                            <span className="text-muted-foreground text-xs">
                              ({division.weight} lbs)
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Women&apos;s
                        </h3>
                        {weightClasses.women.map((division) => (
                          <Link
                            key={division.name}
                            href={`/division/${generateDivisionSlug(
                              division,
                              true
                            )}`}
                            className="block text-sm hover:text-primary"
                          >
                            {division.name}{" "}
                            <span className="text-muted-foreground text-xs">
                              ({division.weight} lbs)
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Rankings */}
                  <div className="space-y-3">
                    <h2 className="text-sm font-medium">Rankings</h2>
                    <div className="pl-4 space-y-2">
                      {rankings.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block text-sm hover:text-primary"
                        >
                          {item.name}{" "}
                          <span className="text-muted-foreground text-xs">
                            {item.suffix}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
