import { Athlete } from "./athlete";

// P4P Rankings Props
export interface P4PRankingsProps {
  maleP4PRankings: Athlete[];
  femaleP4PRankings: Athlete[];
}

// Champions Section Props
export interface ChampionsSectionProps {
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
}

// Division Rankings Props
export interface DivisionRankingsProps {
  division: string;
  athletes: Athlete[];
}

// Fighter interface for P4P sidebar
export interface Fighter {
  id: string;
  name: string;
  imageUrl: string;
  updatedAt?: Date | string;
  poundForPoundRank: number;
  wins: number;
  losses: number;
  draws: number;
  country: string;
  weightDivision: string;
  gender?: string;
}

// P4P Sidebar Props
export interface P4PSidebarProps {
  maleP4PRankings: Fighter[];
  femaleP4PRankings: Fighter[];
}
