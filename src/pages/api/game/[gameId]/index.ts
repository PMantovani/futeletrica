// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Game } from "@/models/game";
import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseClient } from "../../_createSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("Game")
    .select("*")
    .eq("id", req.query.gameId);

  if (error) {
    console.error(error);
    res.status(500);
  } else {
    res.status(200).json(data[0]);
  }
}
