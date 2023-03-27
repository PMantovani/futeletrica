import { GetServerSideProps } from "next";
import { Header } from "@/components/header";
import { convertGameResultInput, GameResultInput } from "@/models/game_result";
import { Main } from "@/components/main";
import { ChangeEvent, useEffect, useState } from "react";
import { Color, colorLabelsMap } from "@/models/color";
import { Button } from "@/components/button";
import { ssg } from "@/server/utils/ssg_helper";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { GameResult } from "@prisma/client";

export default function Home() {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);

  const gameQuery = trpc.game.findById.useQuery(gameIdNumber);
  const gameResultsQuery = trpc.game.gameResults.findAllByGameId.useQuery(gameIdNumber);

  const createResultsMutation = trpc.game.gameResults.createResults.useMutation();
  const updateResultsMutation = trpc.game.gameResults.updateResults.useMutation();

  if (!gameQuery.data || !gameResultsQuery.data) {
    throw new Error("Data not prefetched from SSG");
  }

  const [results, setResults] = useState<GameResultInput[]>([]);
  const [isNewResult, setIsNewResult] = useState(gameResultsQuery.data.length === 0);

  useEffect(() => {
    if (!isNewResult) {
      setResults(gameResultsQuery.data);
    } else {
      if (gameQuery.data === null) {
        throw new Error("No such game");
      }
      const gameId = gameQuery.data.id;

      setResults([
        {
          color1: "yellow",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 0,
          gameId,
        },
        {
          color1: "yellow",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 1,
          gameId,
        },
        {
          color1: "white",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 2,
          gameId,
        },
        {
          color1: "white",
          color2: "yellow",
          goals1: 0,
          goals2: 0,
          match: 3,
          gameId,
        },
        {
          color1: "blue",
          color2: "yellow",
          goals1: 0,
          goals2: 0,
          match: 4,
          gameId,
        },
        {
          color1: "blue",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 5,
          gameId,
        },
        {
          color1: "yellow",
          color2: "white",
          goals1: 0,
          goals2: 0,
          match: 6,
          gameId,
        },
        {
          color1: "yellow",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 7,
          gameId,
        },
        {
          color1: "white",
          color2: "blue",
          goals1: 0,
          goals2: 0,
          match: 8,
          gameId,
        },
      ]);
    }
  }, [gameResultsQuery.data]);

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
        await createResultsMutation.mutateAsync(results.map((i) => convertGameResultInput(i)));
        gameResultsQuery.refetch();
        setIsNewResult(false);
      } else {
        await updateResultsMutation.mutateAsync(results.map((i) => convertGameResultInput(i)) as GameResult[]);
        gameResultsQuery.refetch();
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = validateRouterQueryToNumber(context.query.gameId);
  await Promise.all([ssg.game.findById.prefetch(gameId), ssg.game.gameResults.findAllByGameId.prefetch(gameId)]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
