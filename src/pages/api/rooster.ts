// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Rooster, RoosterDbWithJoin } from "@/models/rooster";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Rooster[]>
) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("No supabase url/key found");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("Rooster")
    .select(
      "*, athlete1:Athlete!Rooster_athlete1_fkey(*), athlete2:Athlete!Rooster_athlete2_fkey(*), athlete3:Athlete!Rooster_athlete3_fkey(*), athlete4:Athlete!Rooster_athlete4_fkey(*), athlete5:Athlete!Rooster_athlete5_fkey(*)"
    )
    .eq("game", 1);

  if (error) {
    console.error(error);
    res.status(500);
  } else {
    const result: Rooster[] = data.map((i: RoosterDbWithJoin) => ({
      id: i.id,
      game: i.game,
      color: i.color,
      athletes: [i.athlete1, i.athlete2, i.athlete3, i.athlete4, i.athlete5],
      created_at: i.created_at,
    }));
    res.status(200).json(result);
  }
}
