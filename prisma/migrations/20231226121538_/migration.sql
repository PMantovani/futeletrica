/*
  Warnings:

  - A unique constraint covering the columns `[seasonId,athleteId]` on the table `SeasonRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SeasonRating_seasonId_athleteId_key" ON "SeasonRating"("seasonId", "athleteId");
