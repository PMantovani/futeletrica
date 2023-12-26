import { Standings, computeGameResultsIntoStandings } from "@/models/game_result";
import { prisma } from "../utils/prisma_client";
import { findGameResultsByGameId } from "./game_results";
import { findAllRostersByGameId } from "./roster";
import { Athlete } from "@prisma/client";
import { deltaRatingPerPerformanceContribution, deltaRatingPerStandingContribution } from "@/utils/constants";
import { roundToDecimalPlaces } from "@/utils/functions";
import { TRPCError } from "@trpc/server";
import { Color } from "@/models/color";

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

    let updatedAthletes: Athlete[] = [];
    if (game.gameDate.getFullYear() >= 2024) {
      updatedAthletes = calculateNewRatings(standings, rosters);
    } else {
      updatedAthletes = calculateOldRatings(standings, rosters);
    }

    await Promise.all(
      updatedAthletes.map((athlete) => transaction.athlete.update({ data: athlete, where: { id: athlete.id } }))
    );

    await Promise.all(
      updatedAthletes.map((athlete) =>
        transaction.seasonRating.upsert({
          where: { seasonId_athleteId: { athleteId: athlete.id, seasonId: BigInt(game.seasonId) } },
          create: {
            startRating:
              rosters
                .map((i) => i.athletes)
                .flat()
                .find((i) => i.id === athlete.id)?.rating ?? athlete.rating,
            endRating: athlete.rating,
            athleteId: athlete.id,
            seasonId: BigInt(game.seasonId),
          },
          update: {
            endRating: athlete.rating,
          },
        })
      )
    );

    await transaction.game.update({ data: { computed: true }, where: { id: gameId } });
    return;
  });
};

function calculateNewRatings(standings: Standings[], rosters: Awaited<ReturnType<typeof findAllRostersByGameId>>) {
  let updatedAthletes: Athlete[] = [];
  standings.forEach((standing) => {
    const deltaRatingForColor = getRatingsDeltaForRoster(standings, standing.color);
    const athletesInColor = rosters.find((i) => i.color === standing.color)?.athletes ?? [];
    updatedAthletes = [
      ...updatedAthletes,
      ...athletesInColor.map((athlete) => ({
        ...athlete,
        rating: roundToDecimalPlaces(athlete.rating + deltaRatingForColor),
      })),
    ];
  });
  return updatedAthletes;
}

function calculateOldRatings(standings: Standings[], rosters: Awaited<ReturnType<typeof findAllRostersByGameId>>) {
  const colorToEarnPoints = standings[0].color;
  const colorToLosePoints = standings[standings.length - 1].color;

  const rosterToEarnPoints = rosters.find((i) => i.color === colorToEarnPoints)?.athletes;
  const rosterToLosePoints = rosters.find((i) => i.color === colorToLosePoints)?.athletes;

  let updatedAthletes: Athlete[] = [];
  if (rosterToEarnPoints) {
    updatedAthletes = [
      ...rosterToEarnPoints.map((i) => ({
        ...i,
        rating: roundToDecimalPlaces(i.rating + deltaRatingPerStandingContribution),
      })),
    ];
  }
  if (rosterToLosePoints) {
    updatedAthletes = [
      ...updatedAthletes,
      ...rosterToLosePoints.map((i) => ({
        ...i,
        rating: roundToDecimalPlaces(i.rating - deltaRatingPerStandingContribution),
      })),
    ];
  }
  return updatedAthletes;
}

export function getRatingsDeltaForRoster(standings: Standings[], rosterColor: Color) {
  return (
    getRatingsDeltaByStandingsContribution(standings, rosterColor) +
    getRatingsDeltaByPerformanceContribution(standings, rosterColor)
  );
}

export function getRatingsDeltaByStandingsContribution(standings: Standings[], rosterColor: Color) {
  const deltaRatingByStanding = [deltaRatingPerStandingContribution, 0, -deltaRatingPerStandingContribution];

  const rosterStandingPosition = standings.findIndex((i) => i.color === rosterColor);
  if (rosterStandingPosition === -1 || rosterStandingPosition >= deltaRatingByStanding.length) {
    console.warn("Invalid roster standing", rosterStandingPosition);
    return 0;
  }

  return deltaRatingByStanding[rosterStandingPosition];
}

export function getRatingsDeltaByPerformanceContribution(standings: Standings[], rosterColor: Color) {
  const rosterStanding = standings.find((i) => i.color === rosterColor);
  if (!rosterStanding) {
    console.warn("Invalid roster standing", rosterColor);
    return 0;
  }

  // We can't use rosterStanding.percentage directly because it's not based upon the number of points to avoid skewing of the ratings
  const equalityNumberOfGames = rosterStanding.games / 2;
  const unitVariation =
    (rosterStanding.victories + rosterStanding.draws / 2 - equalityNumberOfGames) / equalityNumberOfGames;
  return unitVariation * deltaRatingPerPerformanceContribution;
}
