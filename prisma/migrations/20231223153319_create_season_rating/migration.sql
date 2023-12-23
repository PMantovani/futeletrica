-- CreateTable
CREATE TABLE "SeasonRating" (
    "id" BIGSERIAL NOT NULL,
    "seasonId" BIGINT NOT NULL,
    "athleteId" BIGINT NOT NULL,
    "startRating" DOUBLE PRECISION NOT NULL,
    "endRating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeasonRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeasonRating" ADD CONSTRAINT "SeasonRating_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SeasonRating" ADD CONSTRAINT "SeasonRating_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
