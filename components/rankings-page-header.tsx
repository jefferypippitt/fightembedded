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
      <div className="pr-12 sm:pr-14">{children}</div>
      <div className="pointer-events-auto absolute right-0 top-0.5 z-10">
        <FollowerSourcesAvatars />
      </div>
    </header>
  );
}
