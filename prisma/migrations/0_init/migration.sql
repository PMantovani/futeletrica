-- CreateTable
CREATE TABLE "Athlete" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" TEXT,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" BIGSERIAL NOT NULL,
    "gameDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameResult" (
    "id" BIGSERIAL NOT NULL,
    "gameId" BIGINT,
    "color1" TEXT NOT NULL,
    "color2" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "goals1" SMALLINT NOT NULL,
    "goals2" SMALLINT NOT NULL,
    "match" SMALLINT NOT NULL,

    CONSTRAINT "GameResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roster" (
    "id" BIGSERIAL NOT NULL,
    "gameId" BIGINT,
    "color" TEXT,
    "athlete1Id" BIGINT,
    "athlete2Id" BIGINT,
    "athlete3Id" BIGINT,
    "athlete4Id" BIGINT,
    "athlete5Id" BIGINT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rooster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_athlete1Id_fkey" FOREIGN KEY ("athlete1Id") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_athlete2Id_fkey" FOREIGN KEY ("athlete2Id") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_athlete3Id_fkey" FOREIGN KEY ("athlete3Id") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_athlete4Id_fkey" FOREIGN KEY ("athlete4Id") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_athlete5Id_fkey" FOREIGN KEY ("athlete5Id") REFERENCES "Athlete"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

