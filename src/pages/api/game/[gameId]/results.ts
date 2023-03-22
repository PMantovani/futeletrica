// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GameResult } from "@/models/game_result";
import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseClient } from "../../_createSupabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await getGameResults(req, res);
  } else if (req.method === "POST") {
    await postGameResults(req, res);
  } else if (req.method === "PUT") {
    await putGameResults(req, res);
  } else {
    res.status(500).json("Handler not found");
  }
}

async function getGameResults(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("GameResult").select().eq("game", req.query.gameId);

  if (error) {
    console.error(error);
    res.status(500).json(error.message);
  } else {
    const result: GameResult[] = data;
    res.status(200).json(result);
  }
}

async function postGameResults(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createSupabaseClient();

  for (const row of req.body) {
    const { data, error } = await supabase.from("GameResult").insert(row);

    if (error) {
      res.status(500).json(error.message);
      return;
    }
  }

  const { data, error } = await supabase.from("GameResult").select().eq("game", req.query.gameId).order("match");
  if (error) {
    res.status(500).json(error.message);
    return;
  }
  res.status(200).json(data);
}

async function putGameResults(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createSupabaseClient();

  for (const row of req.body) {
    const { data, error } = await supabase.from("GameResult").update(row).eq("id", row.id);

    if (error) {
      res.status(500).json(error.message);
      return;
    }
  }
  res.status(200).json(req.body);
}
