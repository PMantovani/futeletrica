-- DropForeignKey
ALTER TABLE "AthletesOnRosters" DROP CONSTRAINT "AthletesOnRosters_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "AthletesOnRosters" DROP CONSTRAINT "AthletesOnRosters_rosterId_fkey";

-- AddForeignKey
ALTER TABLE "AthletesOnRosters" ADD CONSTRAINT "AthletesOnRosters_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthletesOnRosters" ADD CONSTRAINT "AthletesOnRosters_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
