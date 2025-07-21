"use client";

import { IconLogout } from "@tabler/icons-react";
import { signOut } from "@/server/actions/auth";
import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button className="w-full justify-start" variant="ghost">
        <IconLogout className="size-4 text-red-500" />
        <span>Sign Out</span>
      </Button>
    </form>
  );
}
