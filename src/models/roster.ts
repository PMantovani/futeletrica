import { Athlete } from "./athlete";
import { Color } from "./color";

export interface Roster {
  id: string;
  gameId: string;
  color: Color;
  athletes: Athlete[];
  createdAt: string;
}

export interface RosterDbWithJoin {
  id: string;
  gameId: string;
  color: Color;
  athlete1Id: Athlete;
  athlete2Id: Athlete;
  athlete3Id: Athlete;
  athlete4Id: Athlete;
  athlete5Id: Athlete;
  createdAt: string;
}
