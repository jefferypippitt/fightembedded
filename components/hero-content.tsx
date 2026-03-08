import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-start text-left space-y-3 md:space-y-4 w-full lg:flex-1">
      <div className="space-y-1 w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white text-balance">
          Your Ultimate Source For
        </h1>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-red-500 dark:text-red-500 text-balance">
          UFC Athletes & Events
        </h1>
      </div>
      <div className="mt-2">
        <Button asChild variant="outline" size="lg">
          <Link href="/athletes" className="tracking-wide font-medium uppercase text-xs sm:text-sm">Explore All Athletes</Link>
        </Button>
      </div>
    </div>
  );
}