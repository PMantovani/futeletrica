import { Standings } from "@/models/game_result";
import {
  getRatingsDeltaByPerformanceContribution,
  getRatingsDeltaByStandingsContribution,
  getRatingsDeltaForRoster,
} from "./game";
import { deltaRatingPerPerformanceContribution, deltaRatingPerStandingContribution } from "@/utils/constants";

describe("Rating variation calculations", () => {
  describe("standings contribution", () => {
    test("should give the default delta rating for first place in standings", () => {
      const standings = createMaxDiffStandings();
      const whiteDelta = getRatingsDeltaByStandingsContribution(standings, "white");
      expect(whiteDelta).toBeCloseTo(deltaRatingPerStandingContribution);
    });

    test("should not give any delta rating for second place in standings", () => {
      const standings = createMaxDiffStandings();
      const blueDelta = getRatingsDeltaByStandingsContribution(standings, "blue");
      expect(blueDelta).toBeCloseTo(0);
    });

    test("should give the default negative delta rating for third place in standings", () => {
      const standings = createMaxDiffStandings();
      const yellowDelta = getRatingsDeltaByStandingsContribution(standings, "yellow");
      expect(yellowDelta).toBeCloseTo(-deltaRatingPerStandingContribution);
    });
  });

  describe("performance contribution", () => {
    test("should give the maximum delta rating when performance is 100%", () => {
      const standings = createMaxDiffStandings();
      const whiteDelta = getRatingsDeltaByPerformanceContribution(standings, "white");
      expect(whiteDelta).toBeCloseTo(deltaRatingPerPerformanceContribution);
    });

    test("should not give any delta rating for average performance", () => {
      const standings = createMaxDiffStandings();
      const blueDelta = getRatingsDeltaByStandingsContribution(standings, "blue");
      expect(blueDelta).toBeCloseTo(0);
    });

    test("should give the maximum negative delta rating when performance is 0%", () => {
      const standings = createMaxDiffStandings();
      const yellowDelta = getRatingsDeltaByStandingsContribution(standings, "yellow");
      expect(yellowDelta).toBeCloseTo(-deltaRatingPerPerformanceContribution);
    });

    test("should give 50% of delta rating maximum points when performance is 75%", () => {
      const standings: Standings[] = [
        {
          color: "white",
          games: 6,
          victories: 3,
          draws: 3,
          losses: 0,
          goalsAgainst: 0,
          goalsScored: 3,
          goalsDifference: 3,
          percentage: 0.75,
          points: 12,
        },
      ];
      const whiteDelta = getRatingsDeltaByPerformanceContribution(standings, "white");
      expect(whiteDelta).toBeCloseTo(deltaRatingPerPerformanceContribution * 0.5);
    });

    test("should give -50% of delta rating maximum points when performance is 25%", () => {
      const standings: Standings[] = [
        {
          color: "white",
          games: 6,
          victories: 0,
          draws: 3,
          losses: 3,
          goalsAgainst: 0,
          goalsScored: 3,
          goalsDifference: 3,
          percentage: 0.75,
          points: 12,
        },
      ];
      const whiteDelta = getRatingsDeltaByPerformanceContribution(standings, "white");
      expect(whiteDelta).toBeCloseTo(-deltaRatingPerPerformanceContribution * 0.5);
    });

    test("should not give any delta rating when performance is all draws", () => {
      const standings: Standings[] = [
        {
          color: "white",
          victories: 0,
          draws: 6,
          losses: 0,
          games: 6,
          goalsAgainst: 0,
          goalsScored: 0,
          goalsDifference: 0,
          percentage: 0.5,
          points: 6,
        },
      ];
      const whiteDelta = getRatingsDeltaByPerformanceContribution(standings, "white");
      expect(whiteDelta).toBeCloseTo(0);
    });
  });

  describe("combined contributions", () => {
    test("should give both max delta ratings for 100% performance and first place in standings", () => {
      const standings = createMaxDiffStandings();
      const whiteDelta = getRatingsDeltaForRoster(standings, "white");
      expect(whiteDelta).toBeCloseTo(deltaRatingPerStandingContribution + deltaRatingPerPerformanceContribution);
    });

    test("should give 0 delta rating for average performance and second place in standings", () => {
      const standings = createMaxDiffStandings();
      const blueDelta = getRatingsDeltaForRoster(standings, "blue");
      expect(blueDelta).toBeCloseTo(0);
    });

    test("should give both max negative delta ratings for 0% performance and third place in standings", () => {
      const standings = createMaxDiffStandings();
      const yellowDelta = getRatingsDeltaForRoster(standings, "yellow");
      expect(yellowDelta).toBeCloseTo(-deltaRatingPerStandingContribution - deltaRatingPerPerformanceContribution);
    });
  });
});

function createMaxDiffStandings(): Standings[] {
  return [
    {
      color: "white",
      games: 6,
      victories: 6,
      draws: 0,
      losses: 0,
      points: 18,
      goalsAgainst: 0,
      goalsDifference: 20,
      goalsScored: 20,
      percentage: 1,
    },
    {
      color: "blue",
      games: 6,
      victories: 3,
      draws: 0,
      losses: 3,
      points: 9,
      goalsAgainst: 10,
      goalsDifference: 0,
      goalsScored: 10,
      percentage: 0.5,
    },
    {
      color: "yellow",
      games: 6,
      victories: 0,
      draws: 0,
      losses: 6,
      points: 0,
      goalsAgainst: 20,
      goalsDifference: -20,
      goalsScored: 0,
      percentage: 0,
    },
  ];
}
