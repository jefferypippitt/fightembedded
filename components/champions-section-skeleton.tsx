import { AthleteCardSkeleton } from "@/components/athlete-skeleton";

export function ChampionsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Male Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <AthleteCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Female Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <AthleteCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
