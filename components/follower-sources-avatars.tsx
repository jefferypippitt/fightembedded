"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import { InstagramIcon } from "@/components/ui/svgs/instagramIcon";
import { XIcon } from "@/components/ui/svgs/xIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FollowerSourcesAvatars() {
  return (
    <TooltipProvider delayDuration={200}>
      <AvatarGroup
        className="-space-x-1.5"
        aria-label="Follower totals combine Instagram and X (formerly Twitter)"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              size="sm"
              className="cursor-default border border-border/60 bg-background"
            >
              <AvatarFallback className="rounded-full bg-transparent p-1">
                <InstagramIcon className="size-full" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="bottom">Instagram</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              size="sm"
              className="cursor-default border border-border/60 bg-background"
            >
              <AvatarFallback className="rounded-full bg-transparent p-1.5 text-foreground">
                <XIcon className="size-full" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="bottom">X (formerly Twitter)</TooltipContent>
        </Tooltip>
      </AvatarGroup>
    </TooltipProvider>
  );
}
