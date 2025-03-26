"use client";

import { Button } from "./ui/button";
import { signOut } from "@/server/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button className="w-full" type="submit">
        Sign Out
      </Button>
    </form>
  );
}
