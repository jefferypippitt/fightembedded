import { getP4PRankings } from "@/server/actions/get-p4p";
import { P4PSidebarClient } from "./p4p-sidebar";
import { Athlete } from "@prisma/client";

export async function P4PRankings() {
  const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();

  const mapRankings = (rankings: Athlete[]) =>
    rankings.map((fighter) => ({
      ...fighter,
      imageUrl: fighter.imageUrl || "/images/default-avatar.png",
    }));

  return (
    <P4PSidebarClient
      maleP4PRankings={mapRankings(maleP4PRankings)}
      femaleP4PRankings={mapRankings(femaleP4PRankings)}
    />
  );
}
