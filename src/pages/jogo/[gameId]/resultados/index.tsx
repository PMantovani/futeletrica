import { Pill } from "@/components/pill";
import { useState } from "react";
import { Header } from "@/components/header";
import { Main } from "@/components/main";
import { Results } from "@/components/results";
import { StandingsComponent } from "@/components/standings";
import { PageHead } from "@/components/page_head";
import { useGameAndResultsFromQueryParam } from "@/hooks/use-game-and-results";

export default function Home() {
  const { gameResultsQuery, gameIdNumber } = useGameAndResultsFromQueryParam();

  const [mode, setMode] = useState<"results" | "standings">("results");
  const sortedResults = [...(gameResultsQuery.data ?? [])].sort((a, b) => a.match - b.match);

  return (
    <>
      <PageHead description={`Confira os resultados do jogo ${gameIdNumber}`} />
      <Main>
        <Header />
        <div className="mx-auto flex pb-6">
          <Pill className="mr-4" isSelected={mode === "results"} onClick={() => setMode("results")}>
            Resultados
          </Pill>
          <Pill isSelected={mode === "standings"} onClick={() => setMode("standings")}>
            Classificação
          </Pill>
        </div>
        {gameResultsQuery.isLoading && <div className="mx-auto">Carregando...</div>}
        {mode === "results" ? <Results results={sortedResults} /> : <StandingsComponent results={sortedResults} />}
      </Main>
    </>
  );
}
