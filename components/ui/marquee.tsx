"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  className,
  reverse,
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex min-w-full shrink-0 gap-4 py-4",
        "[--gap:1rem] [--duration:40s]",
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4",
          "animate-marquee",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4",
          "animate-marquee",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
    </div>
  );
}