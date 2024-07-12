import { prisma } from "../utils/prisma_client";
import { computeGameResultsIntoStandings } from "@/models/game_result";
import { getRatingsDeltaForRoster } from "./game";
import { roundToDecimalPlaces } from "@/utils/functions";
import { AthleteSeasonSummary } from "@/models/athlete_season_summary";

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

  const result = elegibleAthletes.map((i) => {
    const sortedArr = [...i.rosters].sort(
      (a, b) => (a.roster.Game?.gameDate?.getTime() ?? 0) - (b.roster.Game?.gameDate?.getTime() ?? 0)
    );
    const lastGameResults = sortedArr
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

export const getAthleteSeasonSummary = async (seasonId: number, athleteId: number): Promise<AthleteSeasonSummary> => {
  const athleteInfo = await prisma.athlete.findFirstOrThrow({
    include: {
      SeasonRating: true,
    },
    where: { id: BigInt(athleteId) },
  });

  const startRating =
    athleteInfo.SeasonRating.find((r) => r.seasonId === BigInt(seasonId))?.startRating ?? athleteInfo.rating;

  const [standings, gamesSequence] = await Promise.all([
    getAthleteStandings(seasonId),
    getAthleteGamesSequence(seasonId, athleteId, startRating),
  ]);
  const absoluteRankingPosition =
    standings.sort((a, b) => b.rating - a.rating).findIndex((i) => i.athleteId === BigInt(athleteId)) + 1;
  const rankingPosition =
    standings.sort((a, b) => b.seasonChange - a.seasonChange).findIndex((i) => i.athleteId === BigInt(athleteId)) + 1;

  return {
    name: athleteInfo.name,
    rating: athleteInfo.rating,
    initialRating: startRating,
    rankingPosition,
    absoluteRankingPosition,
    totalPeopleInRanking: standings.length,
    gamesSequence: gamesSequence,
  };
};

const getAthleteGamesSequence = async (
  seasonId: number,
  athleteId: number,
  startingRating: number
): Promise<AthleteSeasonSummary["gamesSequence"]> => {
  const allSeasonGames = await prisma.game.findMany({
    where: { seasonId, computed: true },
    include: { GameResult: true, Roster: { include: { athletes: true } } },
    orderBy: { gameDate: "asc" },
  });

  let currentRating = startingRating;

  const gamesSequence = allSeasonGames.map((game) => {
    const rosterOfAthlete = game.Roster.find((r) => r.athletes.some((a) => a.athleteId === BigInt(athleteId)));
    if (!rosterOfAthlete) {
      return {
        date: game.gameDate,
        result: "absent" as "victory" | "draw" | "loss" | "absent",
        newRating: currentRating,
        goalsScored: 0,
        goalsAgainst: 0,
      };
    }

    const rosterStandingsAfterGame = computeGameResultsIntoStandings(game.GameResult);
    const athleteStandingPositionAfterGame = rosterStandingsAfterGame.findIndex(
      (i) => i.color === rosterOfAthlete.color
    );
    const athleteStandingAfterGame = rosterStandingsAfterGame[athleteStandingPositionAfterGame];
    const resultMap = ["victory", "draw", "loss"];
    const ratingDelta = getRatingsDeltaForRoster(rosterStandingsAfterGame, rosterOfAthlete.color);
    currentRating += ratingDelta;
    currentRating = roundToDecimalPlaces(currentRating);

    return {
      date: game.gameDate,
      result: resultMap[athleteStandingPositionAfterGame] as "victory" | "draw" | "loss" | "absent",
      newRating: currentRating,
      goalsScored: athleteStandingAfterGame.goalsScored / game.GameResult.length,
      goalsAgainst: athleteStandingAfterGame.goalsAgainst / game.GameResult.length,
    };
  });

  return gamesSequence;
};
