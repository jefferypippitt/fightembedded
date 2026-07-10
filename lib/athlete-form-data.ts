import { athleteSchema } from "@/schemas/athlete";
import type { AthleteInput } from "@/types/athlete";

export function athleteInputFromFormData(formData: FormData): AthleteInput {
  const rawData = Object.fromEntries(formData.entries());

  const data: AthleteInput = {
    name: String(rawData.name),
    gender: rawData.gender as "MALE" | "FEMALE",
    weightDivision: String(rawData.weightDivision),
    country: String(rawData.country),
    age: parseInt(rawData.age as string),
    wins: parseInt(rawData.wins as string),
    losses: parseInt(rawData.losses as string),
    draws: parseInt(rawData.draws as string),
    winsByKo: parseInt(rawData.winsByKo as string),
    winsBySubmission: parseInt(rawData.winsBySubmission as string),
    followers: parseInt(rawData.followers as string),
    rank: rawData.rank ? parseInt(rawData.rank as string) : 0,
    poundForPoundRank: rawData.poundForPoundRank
      ? parseInt(rawData.poundForPoundRank as string)
      : 0,
    imageUrl: String(rawData.imageUrl),
    retired: rawData.retired === "true",
  };

  return athleteSchema.parse(data);
}
