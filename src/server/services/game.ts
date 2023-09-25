import { computeGameResultsIntoStandings } from "@/models/game_result";
import { prisma } from "../utils/prisma_client";
import { findGameResultsByGameId } from "./game_results";
import { findAllRostersByGameId } from "./roster";
import { Athlete } from "@prisma/client";
import { ratingDeltaPerGame } from "@/utils/constants";
import { roundToDecimalPlaces } from "@/utils/functions";
import { TRPCError } from "@trpc/server";

export const findAllGames = async () => {
  return prisma.game.findMany();
};

export const findGameById = async (id: number) => {
  return prisma.game.findUnique({ where: { id } });
};

export const closeGame = async (gameId: number) => {
  await prisma.$transaction(async (transaction) => {
    const game = await transaction.game.findFirst({ where: { id: gameId } });

    if (!game) {
      throw new TRPCError({ code: "NOT_FOUND", message: `Game ${gameId} not found` });
    }

    if (game.computed) {
      throw new TRPCError({ code: "CONFLICT", message: `Game ${gameId} has already been computed` });
    }

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

    await Promise.all(
      updatedAthletes.map((athlete) => transaction.athlete.update({ data: athlete, where: { id: athlete.id } }))
    );

    transaction.game.update({ data: { computed: true }, where: { id: gameId } });
  });
};
