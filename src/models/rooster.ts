import { Athlete } from "./athlete";
import { Color } from "./color";

export interface Rooster {
  id: string;
  game: string;
  color: Color;
  athletes: Athlete[];
  created_at: string;
}

export interface RoosterDbWithJoin {
  id: string;
  game: string;
  color: Color;
  athlete1: Athlete;
  athlete2: Athlete;
  athlete3: Athlete;
  athlete4: Athlete;
  athlete5: Athlete;
  created_at: string;
}
