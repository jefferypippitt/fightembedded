import type { ReactNode } from "react";
import { FollowerSourcesAvatars } from "@/components/follower-sources-avatars";
import { cn } from "@/lib/utils";

type RankingsPageHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function RankingsPageHeader({
  children,
  className,
}: RankingsPageHeaderProps) {
  return (
    <header className={cn("relative isolate", className)}>
      <div className="pr-14 sm:pr-16 md:pr-[4.75rem]">{children}</div>
      <div
        className={cn(
          "pointer-events-auto absolute right-0 top-0 z-10 rounded-full p-1",
          "border border-border/60 bg-background/85 shadow-lg",
          "backdrop-blur-md backdrop-saturate-150",
          "ring-1 ring-black/[0.06] dark:ring-white/10"
        )}
      >
        <FollowerSourcesAvatars />
      </div>
    </header>
  );
}
