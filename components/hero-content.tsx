import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-start gap-3 text-left lg:flex-1 lg:max-w-2xl">
      <h1 className="w-full text-balance text-2xl leading-tight font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
        Your Ultimate Source For <span className="text-primary">UFC Athletes & Events</span>
      </h1>
      <Button asChild variant="outline" size="default" className="text-xs sm:text-sm md:text-base">
        <Link href="/athletes" className="text-center font-medium tracking-wide uppercase">
          Explore All Athletes
        </Link>
      </Button>
    </div>
  );
}