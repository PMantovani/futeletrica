import { findAllAthletes, getAthleteSeasonSummary, getAthleteStandings } from "@/server/services/athlete";
import { procedure, router } from "../../trpc";
import { z } from "zod";

export const athleteRouter = router({
  findAll: procedure.query(() => findAllAthletes()),
  getAthleteStandings: procedure.query(() => getAthleteStandings(2)),
  getAthleteSeasonSummary: procedure
    .input(z.number({ required_error: "Enter an athlete id" }))
    .query((params) => getAthleteSeasonSummary(2, params.input)),
});
