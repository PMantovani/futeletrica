import { GameResult, NewGameResult } from "@/models/game_result";
import { createSupabaseClient } from "../utils/supabase_client";

export const findGameResultsByGameId = async (gameId: number) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("GameResult").select().eq("gameId", gameId);

  if (error) {
    throw error;
  }
  return data as GameResult[];
};

export const createGameResults = async (gameResults: NewGameResult[]) => {
  const supabase = createSupabaseClient();

  for (const result of gameResults) {
    const { data, error } = await supabase.from("GameResult").insert(result);

    if (error) {
      throw error;
    }
  }
};

export const updateGameResults = async (gameResults: GameResult[]) => {
  const supabase = createSupabaseClient();

  for (const result of gameResults) {
    const { data, error } = await supabase.from("GameResult").update(result).eq("id", result.id);

    if (error) {
      throw error;
    }
  }
};
