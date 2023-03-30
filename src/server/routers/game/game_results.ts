import { gameResultSchema, newGameResultSchema, operateOnGameResultInputSchema } from "@/models/game_result";
import {
  createGameResults,
  deleteGameResults,
  findGameResultsByGameId,
  operateOnResults,
  updateGameResults,
} from "@/server/services/game_results";
import { z } from "zod";
import { procedure, router } from "../../trpc";

export const gameResultsRouter = router({
  findAllByGameId: procedure.input(z.number()).query(({ input }) => findGameResultsByGameId(input)),
  createResults: procedure.input(newGameResultSchema.array()).mutation(({ input }) => createGameResults(input)),
  updateResults: procedure.input(gameResultSchema.array()).mutation(({ input }) => updateGameResults(input)),
  deleteResults: procedure.input(gameResultSchema.array()).mutation(({ input }) => deleteGameResults(input)),
  operateOnResults: procedure.input(operateOnGameResultInputSchema).mutation(({ input }) => operateOnResults(input)),
});
