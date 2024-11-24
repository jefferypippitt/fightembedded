import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">{children}</div>
      <div className="py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Fight Embedded. All rights reserved.</p>
      </div>
    </div>
  );
}
