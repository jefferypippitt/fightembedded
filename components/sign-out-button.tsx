"use client";

import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign out error:", error);
        // Still redirect on error - session might be cleared anyway
        router.push("/sign-in");
        return;
      }

      // Success - redirect to sign in
      router.push("/sign-in");
    } catch (err) {
      console.error("Unexpected sign out error:", err);
      // Fallback: redirect anyway
      router.push("/sign-in");
    }
  };

  return (
    <Button
      className="w-full justify-start cursor-pointer"
      variant="ghost"
      onClick={handleSignOut}
    >
      <IconLogout className="size-4 text-red-500" />
      <span>Sign Out</span>
    </Button>
  );
}
