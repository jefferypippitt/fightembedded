export type WeightDivision = {
  name: string;
  slug: string;
  weight?: number;
};

export type WeightClasses = {
  men: WeightDivision[];
  women: WeightDivision[];
};

export const weightClasses: WeightClasses = {
  men: [
    { name: "Heavyweight", slug: "heavyweight", weight: 265 },
    { name: "Light Heavyweight", slug: "light-heavyweight", weight: 205 },
    { name: "Middleweight", slug: "middleweight", weight: 185 },
    { name: "Welterweight", slug: "welterweight", weight: 170 },
    { name: "Lightweight", slug: "lightweight", weight: 155 },
    { name: "Featherweight", slug: "featherweight", weight: 145 },
    { name: "Bantamweight", slug: "bantamweight", weight: 135 },
    { name: "Flyweight", slug: "flyweight", weight: 125 },
  ],
  women: [
    { name: "Bantamweight", slug: "bantamweight", weight: 135 },
    { name: "Flyweight", slug: "flyweight", weight: 125 },
    { name: "Strawweight", slug: "strawweight", weight: 115 },
  ],
};

// Helper functions for division handling
export const generateDivisionSlug = (
  division: WeightDivision,
  isWomen = false
): string => {
  return `${isWomen ? "women" : "men"}-${division.slug}`;
};

export const parseDivisionSlug = (
  slug: string
): {
  gender: "men" | "women";
  divisionSlug: string;
  isValid: boolean;
} => {
  const [gender, ...rest] = slug.split("-");
  const divisionSlug = rest.join("-");
  const isWomen = gender === "women";

  const validDivisions = isWomen ? weightClasses.women : weightClasses.men;
  const isValid = validDivisions.some((d) => d.slug === divisionSlug);

  return {
    gender: isWomen ? "women" : "men",
    divisionSlug,
    isValid,
  };
};

export const getDivisionBySlug = (slug: string): WeightDivision | null => {
  const { gender, divisionSlug, isValid } = parseDivisionSlug(slug);
  if (!isValid) return null;

  const divisions =
    gender === "women" ? weightClasses.women : weightClasses.men;
  return divisions.find((d) => d.slug === divisionSlug) || null;
};

export const getFullDivisionName = (
  division: WeightDivision,
  isWomen: boolean
): string => {
  return `${isWomen ? "Women's" : "Men's"} ${division.name}`;
};

export const getAllDivisions = (): Array<{ slug: string; name: string }> => {
  const menDivisions = weightClasses.men.map((division) => ({
    slug: generateDivisionSlug(division, false),
    name: getFullDivisionName(division, false),
  }));

  const womenDivisions = weightClasses.women.map((division) => ({
    slug: generateDivisionSlug(division, true),
    name: getFullDivisionName(division, true),
  }));

  return [...menDivisions, ...womenDivisions];
};
