import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Information",
  description: "Legal information and policies for Fight Embedded",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div>
        {children}
      </div>
    </div>
  );
} 