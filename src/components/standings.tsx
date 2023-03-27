import { Color, colorLabelsMap, colors } from "@/models/color";
import { GameResult } from "@prisma/client";

interface Standings {
  color: Color;
  points: number;
  games: number;
  victories: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsAgainst: number;
  goalsDifference: number;
  percentage: number;
}

export const Standings: React.FC<{ results: GameResult[] }> = ({ results }) => {
  const calculateValues = (results: GameResult[], color: Color): Standings => {
    const victories = results.filter(
      (i) => (i.color1 === color && i.goals1 > i.goals2) || (i.color2 === color && i.goals2 > i.goals1)
    ).length;

    const draws = results.filter((i) => (i.color1 === color || i.color2 === color) && i.goals1 === i.goals2).length;

    const losses = results.filter(
      (i) => (i.color1 === color && i.goals1 < i.goals2) || (i.color2 === color && i.goals2 < i.goals1)
    ).length;

    const goalsScored = results
      .map((i) => (i.color1 === color ? i.goals1 : i.color2 === color ? i.goals2 : 0))
      .reduce((prev, cur) => prev + cur);
    const goalsAgainst = results
      .map((i) => (i.color1 === color ? i.goals2 : i.color2 === color ? i.goals1 : 0))
      .reduce((prev, cur) => prev + cur);

    const games = victories + draws + losses;
    const points = 3 * victories + draws;

    return {
      color,
      games,
      points,
      victories,
      draws,
      losses,
      goalsScored,
      goalsAgainst,
      goalsDifference: goalsScored - goalsAgainst,
      percentage: points / (3 * games),
    };
  };

  const formattedStandings = colors
    .map((color) => calculateValues(results, color.id))
    .sort((a, b) => b.points - a.points || b.goalsDifference - a.goalsDifference || b.goalsScored - a.goalsScored);

  return (
    <div className="mx-auto max-w-full">
      <table className="block overflow-x-auto whitespace-nowrap">
        <thead className="text-center text-sm uppercase text-neutral-500">
          <tr className="border-b-2 border-solid border-neutral-800">
            <th className="px-3 py-3 even:bg-neutral-800">Classificação</th>
            <th className="px-3 py-3 even:bg-neutral-800">P</th>
            <th className="px-3 py-3 even:bg-neutral-800">J</th>
            <th className="px-3 py-3 even:bg-neutral-800">V</th>
            <th className="px-3 py-3 even:bg-neutral-800">E</th>
            <th className="px-3 py-3 even:bg-neutral-800">D</th>
            <th className="px-3 py-3 even:bg-neutral-800">GP</th>
            <th className="px-3 py-3 even:bg-neutral-800">GC</th>
            <th className="px-3 py-3 even:bg-neutral-800">SG</th>
            <th className="px-3 py-3 even:bg-neutral-800">%</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {formattedStandings.map((standing, idx) => (
            <tr
              key={idx}
              className={`border-b border-solid border-neutral-800 last-of-type:border-0 ${
                standing.color === "white"
                  ? "text-white"
                  : standing.color === "yellow"
                  ? "text-yellow"
                  : "text-blue-400"
              }`}
            >
              <td className="px-3 py-3 text-start even:bg-neutral-800">
                <span className="mr-4">{idx + 1}</span>
                <span>{colorLabelsMap[standing.color]}</span>
              </td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.points}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.games}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.victories}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.draws}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.losses}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.goalsScored}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.goalsAgainst}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{standing.goalsDifference}</td>
              <td className="px-3 py-3 even:bg-neutral-800">{(standing.percentage * 100).toFixed(0) + "%"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
