import { Game } from "@/models/game";
import { createSupabaseClient } from "../utils/supabase_client";

export const findAllGames = async () => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("Game").select("*");

  if (error) {
    throw error;
  }
  return data as Game[];
};

export const findGameById = async (id: number) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("Game").select("*").eq("id", id);

  if (error) {
    throw error;
  }
  return data[0] as Game;
};
