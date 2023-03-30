import { GameResult } from "@prisma/client";
import { z } from "zod";
import { colorSchema } from "./color";

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
