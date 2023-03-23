import { z } from "zod";
import { colorSchema } from "./color";

export const gameResultSchema = z.object({
  id: z.number(),
  game: z.number(),
  match: z.number(),
  color1: colorSchema,
  goals1: z.number(),
  color2: colorSchema,
  goals2: z.number(),
  created_at: z.string(),
});

export const newGameResultSchema = gameResultSchema.omit({ id: true, created_at: true });

type _NewGameResult = z.infer<typeof newGameResultSchema>;
export interface NewGameResult extends _NewGameResult {}

type _GameResult = z.infer<typeof gameResultSchema>;
export interface GameResult extends _GameResult {}

const gameResultInputSchema = gameResultSchema
  .partial({ id: true, created_at: true })
  .extend({ goals1: z.string().or(z.number()), goals2: z.string().or(z.number()) });

type _GameResultInput = z.infer<typeof gameResultInputSchema>;
export interface GameResultInput extends _GameResultInput {}

export function convertGameResultInput(input: GameResultInput): NewGameResult | GameResult {
  const goals1 = parseInt(input.goals1.toString());
  const goals2 = parseInt(input.goals2.toString());

  if (isNaN(goals1) || isNaN(goals2)) {
    throw new Error("Goals are not parseable to numbers");
  }

  if (!input.id || !input.created_at) {
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
      created_at: input.created_at,
      goals1,
      goals2,
    };
    return result;
  }
}
