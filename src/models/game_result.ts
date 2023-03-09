import { Color } from "./color";

export interface GameResult {
  id: string;
  gameId: string;
  match: number;
  color1: Color;
  goals1: number;
  color2: Color;
  goals2: number;
  created_at: string;
}
