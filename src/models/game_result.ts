import { GameResult } from "@prisma/client";
import { z } from "zod";
import { Color, colorSchema, colors } from "./color";

export const gameResultSchema = z.object({
  id: z.bigint(),
  gameId: z.bigint(),
  match: z.number(),
  color1: colorSchema,
  goals1: z.number(),
  color2: colorSchema,
  goals2: z.number(),
  createdAt: z.date(),
});

export const newGameResultSchema = gameResultSchema.omit({ id: true, createdAt: true });

type _NewGameResult = z.infer<typeof newGameResultSchema>;
export interface NewGameResult extends _NewGameResult {}

const gameResultInputSchema = gameResultSchema
  .partial({ id: true, createdAt: true })
  .extend({ goals1: z.string().or(z.number()), goals2: z.string().or(z.number()) });

type _GameResultInput = z.infer<typeof gameResultInputSchema>;
export interface GameResultInput extends _GameResultInput {}

export const operateOnGameResultInputSchema = z.object({
  create: newGameResultSchema.array(),
  update: gameResultSchema.array(),
  delete: gameResultSchema.array(),
});

export type OperateOnGameResultInput = z.infer<typeof operateOnGameResultInputSchema>;

export function convertGameResultInput(input: GameResultInput): NewGameResult | GameResult {
  const goals1 = parseInt(input.goals1.toString());
  const goals2 = parseInt(input.goals2.toString());

  if (isNaN(goals1) || isNaN(goals2)) {
    throw new Error("Goals are not parseable to numbers");
  }

  if (!input.id || !input.createdAt) {
    const result: NewGameResult = {
      ...input,
      goals1,
      goals2,
    };
    return result;
  } else {
    const result: GameResult = {
      ...input,
      id: input.id,
      createdAt: input.createdAt,
      goals1,
      goals2,
    };
    return result;
  }
}

export interface Standings {
  color: Color;
  points: number;
  games: number;
  victories: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsAgainst: number;
  goalsDifference: number;
  percentage: number;
}

export function computeGameResultsIntoStandings(gameResults: GameResult[]) {
  const calculateValues = (results: GameResult[], color: Color): Standings => {
    const victories = results.filter(
      (i) => (i.color1 === color && i.goals1 > i.goals2) || (i.color2 === color && i.goals2 > i.goals1)
    ).length;

    const draws = results.filter((i) => (i.color1 === color || i.color2 === color) && i.goals1 === i.goals2).length;

    const losses = results.filter(
      (i) => (i.color1 === color && i.goals1 < i.goals2) || (i.color2 === color && i.goals2 < i.goals1)
    ).length;

    const goalsScored = results
      .map((i) => (i.color1 === color ? i.goals1 : i.color2 === color ? i.goals2 : 0))
      .reduce((prev, cur) => prev + cur);
    const goalsAgainst = results
      .map((i) => (i.color1 === color ? i.goals2 : i.color2 === color ? i.goals1 : 0))
      .reduce((prev, cur) => prev + cur);

    const games = victories + draws + losses;
    const points = 3 * victories + draws;

    return {
      color,
      games,
      points,
      victories,
      draws,
      losses,
      goalsScored,
      goalsAgainst,
      goalsDifference: goalsScored - goalsAgainst,
      percentage: points / (3 * games),
    };
  };

  const formattedStandings = colors
    .map((color) => calculateValues(gameResults, color.id))
    .sort((a, b) => b.points - a.points || b.goalsDifference - a.goalsDifference || b.goalsScored - a.goalsScored);

  return formattedStandings;
}
