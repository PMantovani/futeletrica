import { Roster, RosterDbWithJoin } from "@/models/roster";
import { createSupabaseClient } from "../utils/supabase_client";

export const findAllRostersByGameId = async (gameId: number) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("Roster")
    .select(
      "*, athlete1:Athlete!Roster_athlete1_fkey(*), athlete2:Athlete!Roster_athlete2_fkey(*), athlete3:Athlete!Roster_athlete3_fkey(*), athlete4:Athlete!Roster_athlete4_fkey(*), athlete5:Athlete!Roster_athlete5_fkey(*)"
    )
    .eq("game", gameId);

  if (error) {
    throw error;
  }

  const result: Roster[] = data.map((i: RosterDbWithJoin) => ({
    id: i.id,
    game: i.game,
    color: i.color,
    athletes: [i.athlete1, i.athlete2, i.athlete3, i.athlete4, i.athlete5],
    created_at: i.created_at,
  }));
  return result;
};
