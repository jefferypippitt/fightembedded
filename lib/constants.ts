export const WEIGHT_DIVISIONS = {
  MALE: [
    "Flyweight",
    "Bantamweight",
    "Featherweight",
    "Lightweight",
    "Welterweight",
    "Middleweight",
    "Light Heavyweight",
    "Heavyweight",
  ],
  FEMALE: ["Strawweight", "Flyweight", "Bantamweight"],
} as const;

// Weight division order for sorting (heaviest to lightest)
export const WEIGHT_DIVISION_ORDER = {
  MALE: [
    "Heavyweight",
    "Light Heavyweight",
    "Middleweight",
    "Welterweight",
    "Lightweight",
    "Featherweight",
    "Bantamweight",
    "Flyweight",
  ],
  FEMALE: ["Featherweight", "Bantamweight", "Flyweight", "Strawweight"],
} as const;

// Import the Prisma enum type
export type Gender = "MALE" | "FEMALE";
export type WeightDivision =
  | (typeof WEIGHT_DIVISIONS.MALE)[number]
  | (typeof WEIGHT_DIVISIONS.FEMALE)[number];
