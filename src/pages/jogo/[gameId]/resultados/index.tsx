import { AthleteCard } from "@/components/athlete_card";
import axios from "axios";
import { Roster } from "@/models/roster";
import { Color, colorLabelsMap, ColorObj, colors } from "@/models/color";
import { Pill } from "@/components/pill";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Header } from "@/components/header";
import { Game } from "@/models/game";
import { GameResult } from "@/models/game_result";
import { Main } from "@/components/main";
import { Results } from "@/components/results";
import { Standings } from "@/components/standings";

export default function Home(props: { results: GameResult[]; game: Game }) {
  const [mode, setMode] = useState<"results" | "standings">("results");
  const sortedResults = [...props.results].sort((a, b) => a.match - b.match);

  return (
    <>
      <Main>
        <Header />
        <div className="mx-auto flex pb-6">
          <Pill
            className="mr-4"
            isSelected={mode === "results"}
            onClick={() => setMode("results")}
          >
            Resultados
          </Pill>
          <Pill
            isSelected={mode === "standings"}
            onClick={() => setMode("standings")}
          >
            Classificação
          </Pill>
        </div>
        {mode === "results" ? (
          <Results results={sortedResults} />
        ) : (
          <Standings results={sortedResults} />
        )}
      </Main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const results = (
    await axios.get<GameResult[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${context.query.gameId}/results`
    )
  ).data;
  const game = (
    await axios.get<Game>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/game/${context.query.gameId}`
    )
  ).data;
  return { props: { results, game } };
}
