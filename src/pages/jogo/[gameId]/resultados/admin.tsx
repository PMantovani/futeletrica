import { GetServerSideProps } from "next";
import { Header } from "@/components/header";
import { convertGameResultInput, GameResultInput } from "@/models/game_result";
import { Main } from "@/components/main";
import { ChangeEvent, useEffect, useState } from "react";
import { Color, ColorObj, colors } from "@/models/color";
import { Button } from "@/components/button";
import { ssg } from "@/server/utils/ssg_helper";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { GameResult } from "@prisma/client";
import { toast } from "react-hot-toast";
import { formatDate } from "@/formatters/date_formatter";
import { OptionType, Select } from "@/components/select";
import { DeleteIcon } from "@/components/delete_icon";
import { IconButton } from "@/components/icon_button";

export default function Home() {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);

  const gameQuery = trpc.game.findById.useQuery(gameIdNumber);
  const gameResultsQuery = trpc.game.gameResults.findAllByGameId.useQuery(gameIdNumber);

  const operateOnResultsMutation = trpc.game.gameResults.operateOnResults.useMutation({
    onSuccess: () => toast.success("Resultados foram salvos com sucesso"),
    onError: () => toast.error("Erro ao salvar resultados"),
  });

  if (!gameQuery.data || !gameResultsQuery.data) {
    throw new Error("Data not prefetched from SSG");
  }

  const [results, setResults] = useState<GameResultInput[]>([]);
  const [recordsToDelete, setRecordsToDelete] = useState<GameResult[]>([]);

  useEffect(() => {
    setResults(gameResultsQuery.data);
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
    if (!isValid()) {
      toast.error("Valores inválidos.");
    } else {
      const recordsToCreate = results.filter((i) => !i.id);
      const recordsToUpdate = results.filter((i) => !!i.id);

      await operateOnResultsMutation.mutateAsync({
        create: recordsToCreate.map((i) => convertGameResultInput(i)),
        update: recordsToUpdate.map((i) => convertGameResultInput(i)) as GameResult[],
        delete: recordsToDelete,
      });

      gameResultsQuery.refetch();
      return;
    }
  };

  const isValid = () =>
    !results.some(
      (result) => isValueNaN(result.goals1) || isValueNaN(result.goals2) || result.color1 === result.color2
    );

  const isValueNaN = (val: string | number) => isNaN(parseInt(val.toString()));

  const onTeamColorChange = (color: Color, prop: "color1" | "color2", idx: number) => {
    setResults(
      results.map((result, idxIter) => {
        return idxIter === idx ? { ...result, [prop]: color } : result;
      })
    );
  };

  const onRemoveMatch = (idx: number) => {
    const confirmed = window.confirm("Remover partida?");
    if (confirmed) {
      const recordToDelete = results.find((_, idxIter) => idxIter === idx);
      if (recordToDelete && recordToDelete.id) {
        setRecordsToDelete([...recordsToDelete, recordToDelete as GameResult]);
      }
      setResults(results.filter((_, idxIter) => idxIter !== idx).map((result, idx) => ({ ...result, match: idx })));
    }
  };

  const onAddMatch = () => {
    if (!gameQuery.data) {
      throw new Error("No game data");
    }

    if (results.length > 1) {
      const lastGame = results[results.length - 1];
      const secondLastGame = results[results.length - 2];
      const colorCount: Record<Color, number> = { white: 0, blue: 0, yellow: 0 };
      colorCount[lastGame.color1] = colorCount[lastGame.color1] + 1;
      colorCount[lastGame.color2] = colorCount[lastGame.color2] + 1;
      colorCount[secondLastGame.color1] = colorCount[secondLastGame.color1] + 1;
      colorCount[secondLastGame.color2] = colorCount[secondLastGame.color2] + 1;
      const colorToLeave: Color = colorCount.blue === 2 ? "blue" : colorCount.white === 2 ? "white" : "yellow";
      const colorToStay: Color = lastGame.color1 === colorToLeave ? lastGame.color2 : lastGame.color1;
      const colorToEnter: Color = colors.map((c) => c.id).find((c) => ![colorToLeave, colorToStay].includes(c))!;
      setResults([
        ...results,
        {
          color1: lastGame.color1 === colorToStay ? colorToStay : colorToEnter,
          color2: lastGame.color2 === colorToStay ? colorToStay : colorToEnter,
          gameId: gameQuery.data.id,
          goals1: "",
          goals2: "",
          match: results.length,
        },
      ]);
    } else {
      setResults([
        ...results,
        {
          color1: "yellow",
          color2: "white",
          goals1: "",
          goals2: "",
          match: results.length,
          gameId: gameQuery.data.id,
        },
      ]);
    }
  };

  return (
    <>
      <Main>
        <Header />
        <h2 className="mx-auto mb-10 text-2xl">Resultados do dia {formatDate(gameQuery.data.gameDate)}</h2>
        <div className="mx-auto">
          {results.map((result, idx) => (
            <div className="mb-6 flex" key={idx}>
              <Team color={result.color1} onColorChange={(color) => onTeamColorChange(color, "color1", idx)} />
              <input
                className="mx-4 w-10 border-b border-b-neutral-600 bg-transparent px-1 text-right font-light outline-none"
                type="number"
                value={result.goals1}
                onChange={(evt) => onTeamGoalChange(evt, idx, "goals1")}
              />
              <span className="self-center text-neutral-700">x</span>
              <input
                className="mx-4 w-10 border-b border-b-neutral-600 bg-transparent px-1 font-light  outline-none"
                type="number"
                value={result.goals2}
                onChange={(evt) => onTeamGoalChange(evt, idx, "goals2")}
              />
              <Team color={result.color2} onColorChange={(color) => onTeamColorChange(color, "color2", idx)} />
              <IconButton className="ml-2" onClick={() => onRemoveMatch(idx)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
        <div className="mx-auto flex flex-col items-stretch">
          <Button onClick={onAddMatch}>Adicionar nova partida</Button>
          <Button onClick={save}>Salvar</Button>
        </div>
      </Main>
    </>
  );
}

const Team: React.FC<{ color: Color; onColorChange: (color: Color) => void }> = ({ color, onColorChange }) => {
  const colorsMapped = colors.map((i) => ({ value: i, label: i.label }));

  const createOption = (option: OptionType<ColorObj>) => (
    <div
      className={`${
        option.value.id === "white" ? "text-white" : option.value.id === "yellow" ? "text-yellow" : "text-blue-400"
      }`}
    >
      {option.label}
    </div>
  );

  return (
    <div className="w-24">
      <Select
        value={colorsMapped.find((i) => i.value.id === color)!}
        options={colorsMapped}
        onChange={(val) => onColorChange(val.id)}
        renderOption={createOption}
      ></Select>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = validateRouterQueryToNumber(context.query.gameId);
  await Promise.all([ssg.game.findById.prefetch(gameId), ssg.game.gameResults.findAllByGameId.prefetch(gameId)]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
