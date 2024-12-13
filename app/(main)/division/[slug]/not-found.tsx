import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DivisionNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">Division Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        The UFC weight division you&apos;re looking for doesn&apos;t exist.
        Please check the URL and try again.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
