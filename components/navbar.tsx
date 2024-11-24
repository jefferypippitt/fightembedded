import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-14 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-lg font-medium">Fight Embedded</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
