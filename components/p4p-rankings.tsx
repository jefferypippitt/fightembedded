import { P4PSidebarClient } from "./p4p-sidebar";
import { Athlete } from "@prisma/client";

interface P4PRankingsProps {
  maleP4PRankings: Athlete[];
  femaleP4PRankings: Athlete[];
}

export function P4PRankings({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PRankingsProps) {
  const mapRankings = (rankings: Athlete[]) =>
    rankings.map((fighter) => ({
      ...fighter,
      imageUrl: fighter.imageUrl || "/images/default-avatar.svg",
    }));

  return (
    <P4PSidebarClient
      maleP4PRankings={mapRankings(maleP4PRankings)}
      femaleP4PRankings={mapRankings(femaleP4PRankings)}
    />
  );
}
