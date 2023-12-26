import { prisma } from "../utils/prisma_client";
import { computeGameResultsIntoStandings } from "@/models/game_result";

export const findAllAthletes = () => {
  return prisma.athlete.findMany();
};

export const getAthleteStandings = async (seasonId: number) => {
  const athletes = await prisma.athlete.findMany({
    include: {
      SeasonRating: true,
      rosters: {
        include: { roster: { include: { Game: { include: { GameResult: true } } } } },
        where: { roster: { Game: { seasonId } } },
      },
    },
  });

  const elegibleAthletes = athletes.filter((i) => i.rosters.length > 0 && i.isActive === true);
  elegibleAthletes.forEach((i) =>
    i.rosters.sort((a, b) => a.roster.Game?.gameDate.getTime() ?? 0 - (b.roster.Game?.gameDate.getTime() ?? 0))
  );

  const result = elegibleAthletes.map((i) => {
    const lastGameResults = i.rosters
      .filter((j) => (j.roster.Game?.GameResult.length ?? 0) > 0)
      .slice(-5)
      .map((j) => ({
        color: j.roster.color,
        standings: computeGameResultsIntoStandings(j.roster.Game?.GameResult ?? []),
      }))
      .map((j) => (j.color === j.standings[0]?.color ? "win" : j.color === j.standings[1]?.color ? "neutral" : "loss"));

    const seasonRating = i.SeasonRating.find((j) => j.seasonId === BigInt(seasonId));

    return {
      athleteId: i.id,
      name: i.name,
      rating: seasonRating?.endRating ?? i.rating,
      position: i.position,
      seasonChange: parseFloat(((seasonRating?.endRating ?? 0) - (seasonRating?.startRating ?? 0)).toFixed(2)),
      lastGames: lastGameResults,
    };
  });

  result.sort((a, b) => b.rating - a.rating);

  return result;
};
