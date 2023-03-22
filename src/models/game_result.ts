import { Color } from "./color";

export interface GameResult {
  id: string;
  game: string;
  match: number;
  color1: Color;
  goals1: number;
  color2: Color;
  goals2: number;
  created_at: string;
}

export interface GameResultInput {
  id?: string;
  game: string;
  match: number;
  color1: Color;
  goals1: string | number;
  color2: Color;
  goals2: string | number;
  created_at?: string;
}
