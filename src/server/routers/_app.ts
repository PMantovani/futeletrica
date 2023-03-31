import { router } from "../trpc";
import { athleteRouter } from "./athlete/athlete";
import { gameRouter } from "./game/game";

export const appRouter = router({
  game: gameRouter,
  athlete: athleteRouter,
});

export type AppRouter = typeof appRouter;
