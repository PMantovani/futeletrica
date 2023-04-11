/*
  Warnings:

  - You are about to drop the column `athlete1Id` on the `Roster` table. All the data in the column will be lost.
  - You are about to drop the column `athlete2Id` on the `Roster` table. All the data in the column will be lost.
  - You are about to drop the column `athlete3Id` on the `Roster` table. All the data in the column will be lost.
  - You are about to drop the column `athlete4Id` on the `Roster` table. All the data in the column will be lost.
  - You are about to drop the column `athlete5Id` on the `Roster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Roster" DROP CONSTRAINT "Roster_athlete1Id_fkey";

-- DropForeignKey
ALTER TABLE "Roster" DROP CONSTRAINT "Roster_athlete2Id_fkey";

-- DropForeignKey
ALTER TABLE "Roster" DROP CONSTRAINT "Roster_athlete3Id_fkey";

-- DropForeignKey
ALTER TABLE "Roster" DROP CONSTRAINT "Roster_athlete4Id_fkey";

-- DropForeignKey
ALTER TABLE "Roster" DROP CONSTRAINT "Roster_athlete5Id_fkey";

-- AlterTable
ALTER TABLE "Roster" DROP COLUMN "athlete1Id",
DROP COLUMN "athlete2Id",
DROP COLUMN "athlete3Id",
DROP COLUMN "athlete4Id",
DROP COLUMN "athlete5Id";
