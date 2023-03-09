import { Color, colorLabelsMap } from "@/models/color";
import { GameResult } from "@/models/game_result";

export const Results: React.FC<{ results: GameResult[] }> = ({ results }) => (
  <div className="mx-auto">
    {results.map((result, idx) => (
      <div key={idx} className="relative m-4 flex items-center">
        <TeamContainer
          color={result.color1}
          goals={result.goals1}
          opponentGoals={result.goals2}
          first={true}
        />
        <div className=" absolute left-[48.5%] top-[32%] text-neutral-700">
          x
        </div>
        <TeamContainer
          color={result.color2}
          goals={result.goals2}
          opponentGoals={result.goals1}
          first={false}
        />
      </div>
    ))}
  </div>
);

const TeamContainer: React.FC<{
  color: Color;
  goals: number;
  opponentGoals: number;
  first: boolean;
}> = ({ color, goals, opponentGoals, first }) => {
  return (
    <div
      className={`flex w-32 items-baseline justify-between border-solid py-4 
      ${goals >= opponentGoals ? "border-b-2" : "border-b-0"}
      ${goals > opponentGoals && color === "yellow" ? "border-yellow" : ""}
      ${goals > opponentGoals && color === "white" ? "border-white" : ""}
      ${goals > opponentGoals && color === "blue" ? "border-blue-400" : ""}
      ${goals === opponentGoals ? "border-neutral-600" : ""}
      ${first ? `pr-4` : `pl-4`}
        `}
    >
      {first ? (
        <>
          <Team color={color} />
          <Goals goals={goals} />
        </>
      ) : (
        <>
          <Goals goals={goals} />
          <Team color={color} />
        </>
      )}
    </div>
  );
};

const Goals: React.FC<{ goals: number }> = ({ goals }) => (
  <div className="text-neutral-400">{goals}</div>
);

const Team: React.FC<{ color: Color }> = ({ color }) => (
  <div
    className={`font-light uppercase ${
      color === "white"
        ? "text-white"
        : color === "yellow"
        ? "text-yellow"
        : "text-blue-400"
    }`}
  >
    {colorLabelsMap[color]}
  </div>
);
