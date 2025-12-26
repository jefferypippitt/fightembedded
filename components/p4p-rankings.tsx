import { P4PSidebarClient } from "./p4p-sidebar";
import { P4PRankingsProps } from "@/types/rankings";
import { Athlete } from "@/types/athlete";

export function P4PRankings({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PRankingsProps) {
  // Helper function to map athlete data for P4P sidebar
  const mapRankings = (rankings: Athlete[]) =>
    rankings
      .filter((fighter) => fighter.poundForPoundRank !== undefined)
      .map((fighter) => ({
        ...fighter,
        imageUrl: fighter.imageUrl || "/placeholder/SILHOUETTE.avif",
        draws: fighter.draws ?? 0,
        poundForPoundRank: fighter.poundForPoundRank!,
      }));

  return (
    <P4PSidebarClient
      maleP4PRankings={mapRankings(maleP4PRankings)}
      femaleP4PRankings={mapRankings(femaleP4PRankings)}
    />
  );
}
