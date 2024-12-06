import { Skeleton } from "@/components/ui/skeleton";

export function EventsSectionSkeleton() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Upcoming Events</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

