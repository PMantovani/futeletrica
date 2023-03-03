// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Roster, RosterDbWithJoin } from "@/models/roster";
import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseClient } from "../../_createSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Roster[]>
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("Roster")
    .select(
      "*, athlete1:Athlete!Roster_athlete1_fkey(*), athlete2:Athlete!Roster_athlete2_fkey(*), athlete3:Athlete!Roster_athlete3_fkey(*), athlete4:Athlete!Roster_athlete4_fkey(*), athlete5:Athlete!Roster_athlete5_fkey(*)"
    )
    .eq("game", req.query.gameId);

  if (error) {
    console.error(error);
    res.status(500);
  } else {
    const result: Roster[] = data.map((i: RosterDbWithJoin) => ({
      id: i.id,
      game: i.game,
      color: i.color,
      athletes: [i.athlete1, i.athlete2, i.athlete3, i.athlete4, i.athlete5],
      created_at: i.created_at,
    }));
    res.status(200).json(result);
  }
}
