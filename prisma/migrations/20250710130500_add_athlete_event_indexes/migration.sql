-- CreateIndex
CREATE INDEX "Athlete_retired_rank_idx" ON "Athlete"("retired", "rank");

-- CreateIndex
CREATE INDEX "Athlete_retired_poundForPoundRank_idx" ON "Athlete"("retired", "poundForPoundRank");

-- CreateIndex
CREATE INDEX "Athlete_retired_gender_poundForPoundRank_idx" ON "Athlete"("retired", "gender", "poundForPoundRank");

-- CreateIndex
CREATE INDEX "Athlete_weightDivision_gender_retired_idx" ON "Athlete"("weightDivision", "gender", "retired");

-- CreateIndex
CREATE INDEX "Athlete_retired_followers_idx" ON "Athlete"("retired", "followers");

-- CreateIndex
CREATE INDEX "Athlete_country_idx" ON "Athlete"("country");

-- CreateIndex
CREATE INDEX "event_status_date_idx" ON "event"("status", "date");
