-- CreateEnum
CREATE TYPE "Color" AS ENUM ('white', 'yellow', 'blue');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('ZAG', 'MEI', 'ATA');

-- AlterTable
ALTER TABLE "Athlete" ALTER COLUMN "position" TYPE "Position" USING "position"::"Position", ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "GameResult" ALTER COLUMN "gameId" SET NOT NULL,
ALTER COLUMN "color1" TYPE "Color" USING "color1"::"Color",
ALTER COLUMN "color1" SET NOT NULL,
ALTER COLUMN "color2" TYPE "Color" USING "color2"::"Color",
ALTER COLUMN "color2" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Roster" ALTER COLUMN "color" TYPE "Color" USING "color"::"Color", ALTER COLUMN "color" SET NOT NULL;
