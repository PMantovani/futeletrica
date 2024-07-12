export type AthleteSeasonSummary = {
  name: string;
  rating: number;
  initialRating: number;
  rankingPosition: number;
  absoluteRankingPosition: number;
  totalPeopleInRanking: number;
  gamesSequence: {
    date: Date;
    result: "victory" | "draw" | "loss" | "absent";
    newRating: number;
    goalsScored: number;
    goalsAgainst: number;
  }[];
};
