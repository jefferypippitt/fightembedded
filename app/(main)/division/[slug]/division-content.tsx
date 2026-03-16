import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { AthleteImagePreloads } from "@/components/athlete-image-preloads";
import { getDivisionBySlug, parseDivisionSlug } from "@/data/weight-class";
import { getDivisionAthletes } from "@/server/actions/athlete";

interface DivisionContentProps {
  slug: string;
}

export async function DivisionContent({ slug }: DivisionContentProps) {
  const parseResult = parseDivisionSlug(slug);
  const divisionInfo = getDivisionBySlug(slug);

  if (!divisionInfo || !parseResult.isValid) {
    return null;
  }

  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AthleteImagePreloads athletes={divisionData.athletes} />
      <div className="w-full sm:max-w-xs lg:max-w-sm">
        <AthletesSearchInput
          className="w-full"
          athletes={divisionData.athletes}
        />
      </div>
      <AthletesSearchContainer
        athletes={divisionData.athletes}
        priorityStrategy="rank-1-8"
      />
    </div>
  );
}
