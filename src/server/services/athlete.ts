import { Athlete } from "@prisma/client";
import { prisma } from "../utils/prisma_client";
import { computeGameResultsIntoStandings } from "@/models/game_result";

export const findAllAthletes = () => {
  return prisma.athlete.findMany();
};

export const updateAthletes = (athletes: Athlete[]) => {
  return prisma.$transaction(
    athletes.map((athlete) => prisma.athlete.update({ data: athlete, where: { id: athlete.id } }))
  );
};

export const getAthleteStandings = async () => {
  const athletes = await prisma.athlete.findMany({
    include: { rosters: { include: { roster: { include: { Game: { include: { GameResult: true } } } } } } },
  });

  const elegibleAthletes = athletes.filter((i) => i.rosters.length >= 3);
  elegibleAthletes.forEach((i) =>
    i.rosters.sort((a, b) => a.roster.Game?.gameDate.getTime() ?? 0 - (b.roster.Game?.gameDate.getTime() ?? 0))
  );

  const result = elegibleAthletes.map((i) => {
    const lastGameResults = i.rosters
      .slice(-5)
      .map((j) => ({
        color: j.roster.color,
        standings: computeGameResultsIntoStandings(j.roster.Game?.GameResult ?? []),
      }))
      .map((j) => (j.color === j.standings[0]?.color ? "win" : j.color === j.standings[1]?.color ? "neutral" : "loss"));

    return {
      athleteId: i.id,
      name: i.name,
      rating: i.rating,
      seasonChange: parseFloat((i.rating - i.initialRating).toFixed(2)),
      lastGames: lastGameResults,
    };
  });

  result.sort((a, b) => b.rating - a.rating);

  return result;
};
