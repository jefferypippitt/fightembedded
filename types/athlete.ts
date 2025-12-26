import { z } from "zod";
import { athleteSchema } from "@/schemas/athlete";

// Form input type (from Zod schema)
export type AthleteInput = z.infer<typeof athleteSchema>;

// Form data type (includes id for edit mode)
export type AthleteFormData = AthleteInput & { id: string };

export type ActionResponse = {
  status: "success" | "error";
  message: string;
  data?: Athlete;
};

export interface Athlete {
  id: string;
  name: string;
  imageUrl: string | null;
  country: string;
  wins: number;
  losses: number;
  draws: number | null;
  winsByKo: number;
  winsBySubmission: number;
  rank: number | null;
  poundForPoundRank: number | null;
  followers: number;
  age: number;
  retired: boolean | null;
  weightDivision: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard stats types that match what getDashboardStats actually returns
export interface DashboardStats {
  totalAthletes: {
    value: number;
  };
  recentAthletes: {
    name: string;
    weightDivision: string;
    country: string;
    createdAt: string;
  }[];
  recentlyRetiredAthletes: {
    name: string;
    weightDivision: string;
    country: string;
    updatedAt: string;
    wins: number;
    losses: number;
    winRate: string;
  }[];
  poundForPoundRankings: {
    male: {
      name: string;
      weightDivision: string;
      country: string;
      poundForPoundRank: number | null;
      wins: number;
      losses: number;
      winRate: string;
    } | null;
    female: {
      name: string;
      weightDivision: string;
      country: string;
      poundForPoundRank: number | null;
      wins: number;
      losses: number;
      winRate: string;
    } | null;
  };
  upcomingEvents: {
    name: string;
    date: string;
    venue: string;
    location: string;
  }[];
  totalEvents: number;
  topCountries: {
    country: string;
    count: number;
  }[];
  totalChampions: number;
  mostFollowedAthlete: {
    name: string;
    weightDivision: string;
    country: string;
    followers: number;
    wins: number;
    losses: number;
    winRate: string;
  } | null;
}

// Division stats type that matches what getDivisionStats returns
export interface DivisionStats {
  name: string;
  slug: string;
  data: {
    date: string;
    count: number;
  }[];
}
