import { computeGameResultsIntoStandings } from "@/models/game_result";
import { prisma } from "../utils/prisma_client";
import { findGameResultsByGameId } from "./game_results";
import { findAllRostersByGameId } from "./roster";
import { Athlete } from "@prisma/client";
import { ratingDeltaPerGame } from "@/utils/constants";
import { updateAthletes } from "./athlete";
import { roundToDecimalPlaces } from "@/utils/functions";

export const findAllGames = async () => {
  return prisma.game.findMany();
};

export const findGameById = async (id: number) => {
  return prisma.game.findUnique({ where: { id } });
};

export const closeGame = async (gameId: number) => {
  const gameResults = await findGameResultsByGameId(gameId);
  const standings = computeGameResultsIntoStandings(gameResults);

  const rosters = await findAllRostersByGameId(gameId);

  const colorToEarnPoints = standings[0].color;
  const colorToLosePoints = standings[standings.length - 1].color;

  const rosterToEarnPoints = rosters.find((i) => i.color === colorToEarnPoints)?.athletes;
  const rosterToLosePoints = rosters.find((i) => i.color === colorToLosePoints)?.athletes;

  let updatedAthletes: Athlete[] = [];
  if (rosterToEarnPoints) {
    updatedAthletes = [
      ...rosterToEarnPoints.map((i) => ({
        ...i,
        rating: roundToDecimalPlaces(i.rating + ratingDeltaPerGame),
      })),
    ];
  }
  if (rosterToLosePoints) {
    updatedAthletes = [
      ...updatedAthletes,
      ...rosterToLosePoints.map((i) => ({
        ...i,
        rating: roundToDecimalPlaces(i.rating - ratingDeltaPerGame),
      })),
    ];
  }

  await updateAthletes(updatedAthletes);
};
