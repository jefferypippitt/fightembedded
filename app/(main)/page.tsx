import { getChampions } from "@/server/actions/get-champion";
import { getUpcomingEvents } from "@/server/actions/get-event";
import { getP4PRankings } from "@/server/actions/get-p4p";
import { HomeContent } from "./home-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your Ultimate Source for UFC Fighter Stats. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
};

export default async function Home() {
  const [{ maleChampions, femaleChampions }, events, { maleP4PRankings, femaleP4PRankings }] = await Promise.all([
    getChampions(),
    getUpcomingEvents(),
    getP4PRankings(),
  ]);

  return (
    <HomeContent
      maleChampions={maleChampions}
      femaleChampions={femaleChampions}
      events={events}
      maleP4PRankings={maleP4PRankings}
      femaleP4PRankings={femaleP4PRankings}
    />
  );
}
