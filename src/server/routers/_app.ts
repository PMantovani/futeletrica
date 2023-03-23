import { router } from "../trpc";
import { gameRouter } from "./game/game";

export const appRouter = router({
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
