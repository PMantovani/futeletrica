-- CreateTable
CREATE TABLE "AthletesOnRosters" (
    "rosterId" BIGINT NOT NULL,
    "athleteId" BIGINT NOT NULL,

    CONSTRAINT "AthletesOnRosters_pkey" PRIMARY KEY ("rosterId","athleteId")
);

-- AddForeignKey
ALTER TABLE "AthletesOnRosters" ADD CONSTRAINT "AthletesOnRosters_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthletesOnRosters" ADD CONSTRAINT "AthletesOnRosters_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "AthletesOnRosters" ("rosterId", "athleteId") SELECT id, "athlete1Id" FROM "Roster";
INSERT INTO "AthletesOnRosters" ("rosterId", "athleteId") SELECT id, "athlete2Id" FROM "Roster";
INSERT INTO "AthletesOnRosters" ("rosterId", "athleteId") SELECT id, "athlete3Id" FROM "Roster";
INSERT INTO "AthletesOnRosters" ("rosterId", "athleteId") SELECT id, "athlete4Id" FROM "Roster";
INSERT INTO "AthletesOnRosters" ("rosterId", "athleteId") SELECT id, "athlete5Id" FROM "Roster";
