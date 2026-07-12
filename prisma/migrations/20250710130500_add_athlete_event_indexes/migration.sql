-- Additive only: creates indexes if missing. No table rewrites, no data changes.
-- Does not touch User/Session/Account (login) tables.

CREATE INDEX IF NOT EXISTS "Athlete_retired_rank_idx"
  ON "Athlete"("retired", "rank");

CREATE INDEX IF NOT EXISTS "Athlete_retired_poundForPoundRank_idx"
  ON "Athlete"("retired", "poundForPoundRank");

CREATE INDEX IF NOT EXISTS "Athlete_retired_gender_poundForPoundRank_idx"
  ON "Athlete"("retired", "gender", "poundForPoundRank");

CREATE INDEX IF NOT EXISTS "Athlete_weightDivision_gender_retired_idx"
  ON "Athlete"("weightDivision", "gender", "retired");

CREATE INDEX IF NOT EXISTS "Athlete_retired_followers_idx"
  ON "Athlete"("retired", "followers");

CREATE INDEX IF NOT EXISTS "Athlete_country_idx"
  ON "Athlete"("country");

CREATE INDEX IF NOT EXISTS "event_status_date_idx"
  ON "event"("status", "date");
