import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full">{children}</div>
      </div>
      <div className="py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Fight Embedded. All rights reserved.</p>
      </div>
    </div>
  );
}
