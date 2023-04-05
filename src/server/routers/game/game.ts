import { z } from "zod";
import { closeGame, findAllGames, findGameById } from "../../services/game";
import { procedure, router } from "../../trpc";
import { gameResultsRouter } from "./game_results";
import { rosterRouter } from "./roster";

export const gameRouter = router({
  findById: procedure.input(z.number()).query(({ input }) => findGameById(input)),
  findAll: procedure.query(findAllGames),
  closeGame: procedure.input(z.number()).mutation(({ input }) => closeGame(input)),
  gameResults: gameResultsRouter,
  roster: rosterRouter,
});
