import { Roster, RosterDbWithJoin } from "@/models/roster";
import { createSupabaseClient } from "../utils/supabase_client";

export const findAllRostersByGameId = async (gameId: number) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("Roster")
    .select(
      "*, athlete1Id:Athlete!Roster_athlete1Id_fkey(*), athlete2Id:Athlete!Roster_athlete2Id_fkey(*), athlete3Id:Athlete!Roster_athlete3Id_fkey(*), athlete4Id:Athlete!Roster_athlete4Id_fkey(*), athlete5Id:Athlete!Roster_athlete5Id_fkey(*)"
    )
    .eq("gameId", gameId);

  if (error) {
    throw error;
  }

  const result: Roster[] = data.map((i: RosterDbWithJoin) => ({
    id: i.id,
    gameId: i.gameId,
    color: i.color,
    athletes: [i.athlete1Id, i.athlete2Id, i.athlete3Id, i.athlete4Id, i.athlete5Id],
    createdAt: i.createdAt,
  }));
  return result;
};
