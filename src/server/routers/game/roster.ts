import { findAllRostersByGameId } from "@/server/services/roster";
import { z } from "zod";
import { procedure, router } from "../../trpc";

export const rosterRouter = router({
  findAllByGameId: procedure.input(z.number()).query(({ input }) => findAllRostersByGameId(input)),
});
