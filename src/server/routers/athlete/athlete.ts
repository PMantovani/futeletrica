import { findAllAthletes } from "@/server/services/athlete";
import { procedure, router } from "../../trpc";

export const athleteRouter = router({
  findAll: procedure.query(() => findAllAthletes()),
});