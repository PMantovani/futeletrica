import { colorLabelsMap } from "@/models/color";
import { computeGameResultsIntoStandings } from "@/models/game_result";
import { GameResult } from "@prisma/client";

export const StandingsComponent: React.FC<{ results: GameResult[] }> = ({ results }) => {
  const formattedStandings = computeGameResultsIntoStandings(results);

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
