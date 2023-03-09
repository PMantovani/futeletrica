// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GameResult } from "@/models/game_result";
import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseClient } from "../../_createSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameResult[]>
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("GameResult")
    .select()
    .eq("game", req.query.gameId);

  if (error) {
    console.error(error);
    res.status(500);
  } else {
    const result: GameResult[] = data;
    res.status(200).json(result);
  }
}
