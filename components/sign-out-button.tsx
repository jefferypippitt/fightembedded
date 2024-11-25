import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await auth.api.signOut({
          headers: await headers(),
        });
        redirect("/");
      }}
    >
      <Button className="w-full" type="submit">
        Sign Out
      </Button>
    </form>
  );
}
