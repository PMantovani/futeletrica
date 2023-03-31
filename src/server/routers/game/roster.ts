import { findAllRostersByGameId, generateRoster } from "@/server/services/roster";
import { z } from "zod";
import { procedure, router } from "../../trpc";

export const rosterRouter = router({
  findAllByGameId: procedure.input(z.number()).query(({ input }) => findAllRostersByGameId(input)),
  generateRoster: procedure
    .input(
      z.object({
        gameId: z.bigint(),
        athleteIds: z.bigint().array().length(15, "Need exactly 15 athletes to generate roster"),
      })
    )
    .mutation(({ input }) => generateRoster(input.athleteIds, input.gameId)),
});
