import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { Header } from "@/components/header";
import { Game } from "@/models/game";
import { GameResult, GameResultInput } from "@/models/game_result";
import { Main } from "@/components/main";
import { ChangeEvent, useEffect, useState } from "react";
import { Color, colorLabelsMap } from "@/models/color";
import { Button } from "@/components/button";

export default function Home(props: { results: GameResult[]; game: Game }) {
  const [results, setResults] = useState<GameResultInput[]>([]);
  const [isNewResult, setIsNewResult] = useState(props.results.length === 0);

  useEffect(() => {
    if (!isNewResult) {
      setResults(props.results);
    } else {
      setResults([
        {
          color1: "yellow",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 0,
          game: props.game.id,
        },
        {
          color1: "yellow",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 1,
          game: props.game.id,
        },
        {
          color1: "white",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 2,
          game: props.game.id,
        },
        {
          color1: "white",
          color2: "yellow",
          goals1: 0,
          goals2: 0,
          match: 3,
          game: props.game.id,
        },
        {
          color1: "blue",
          color2: "yellow",
          goals1: 0,
          goals2: 0,
          match: 4,
          game: props.game.id,
        },
        {
          color1: "blue",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 5,
          game: props.game.id,
        },
        {
          color1: "yellow",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 6,
          game: props.game.id,
        },
        {
          color1: "yellow",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 7,
          game: props.game.id,
        },
        {
          color1: "white",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 8,
          game: props.game.id,
        },
      ]);
    }
  }, []);

  const onTeamGoalChange = (evt: ChangeEvent<HTMLInputElement>, idx: number, prop: keyof GameResultInput) => {
    setResults(
      results.map((result, idxIter) => {
        const numValue = parseInt(evt.target.value);
        const formattedValue = !isNaN(numValue) ? numValue : evt.target.value;
        return idxIter === idx ? { ...result, [prop]: formattedValue } : result;
      })
    );
  };

  const save = async () => {
    if (isValid()) {
      if (isNewResult) {
        const updatedResults = (
          await axios.post<GameResult[]>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${props.game.id}/results`,
            results
          )
        ).data;
        setIsNewResult(false);
        setResults(updatedResults);
      } else {
        const updatedResults = (
          await axios.put<GameResult[]>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${props.game.id}/results`,
            results
          )
        ).data;
        setResults(updatedResults);
      }
      return;
    }
  };

  const isValid = () => !results.some((result) => isValueNaN(result.goals1) || isValueNaN(result.goals2));

  const isValueNaN = (val: string | number) => isNaN(parseInt(val.toString()));

  return (
    <>
      <Main>
        <Header />
        <div className="mx-auto">
          {results.map((result, idx) => (
            <div className="mb-6 flex" key={idx}>
              <Team color={result.color1} />
              <input
                className="mx-4 w-10 border-b border-b-neutral-600 bg-transparent px-1 text-right font-light outline-none"
                type="number"
                value={result.goals1}
                onChange={(evt) => onTeamGoalChange(evt, idx, "goals1")}
              />
              <span className="text-neutral-700">x</span>
              <input
                className="mx-4 w-10 border-b border-b-neutral-600 bg-transparent px-1 font-light  outline-none"
                type="number"
                value={result.goals2}
                onChange={(evt) => onTeamGoalChange(evt, idx, "goals2")}
              />
              <Team color={result.color2} />
            </div>
          ))}
        </div>
        <Button onClick={save} className="mx-auto w-32">
          Salvar
        </Button>
      </Main>
    </>
  );
}

const Team: React.FC<{ color: Color }> = ({ color }) => (
  <div
    className={`w-20 font-light uppercase ${
      color === "white" ? "text-white" : color === "yellow" ? "text-yellow" : "text-blue-400"
    }`}
  >
    {colorLabelsMap[color]}
  </div>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const results = (
    await axios.get<GameResult[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${context.query.gameId}/results`)
  ).data;
  const game = (await axios.get<Game>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${context.query.gameId}`)).data;
  return { props: { results, game } };
}
