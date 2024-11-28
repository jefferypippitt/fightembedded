import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function EventsPage() {
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/dashboard/events/new">Create Event</Link>
        </Button>
      </div>
 
    </div>
  );
} 