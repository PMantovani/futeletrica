import { Pill } from "@/components/pill";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Header } from "@/components/header";
import { Main } from "@/components/main";
import { Results } from "@/components/results";
import { Standings } from "@/components/standings";
import { PageHead } from "@/components/page_head";
import { formatDate } from "@/formatters/date_formatter";
import { ssg } from "@/server/utils/ssg_helper";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";

export default function Home() {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);

  const gameQuery = trpc.game.findById.useQuery(gameIdNumber);
  const gameResultsQuery = trpc.game.gameResults.findAllByGameId.useQuery(gameIdNumber);

  if (!gameQuery.data || !gameResultsQuery.data) {
    throw "Data not prefetched from SSG";
  }

  const [mode, setMode] = useState<"results" | "standings">("results");
  const sortedResults = [...gameResultsQuery.data].sort((a, b) => a.match - b.match);

  return (
    <>
      <PageHead description={`Confira os resultados do jogo do dia ${formatDate(gameQuery.data.gameDate)}`} />
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
        {mode === "results" ? <Results results={sortedResults} /> : <Standings results={sortedResults} />}
      </Main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const gameId = validateRouterQueryToNumber(context.query.gameId);

  await Promise.all([ssg.game.findById.prefetch(gameId), ssg.game.gameResults.findAllByGameId.prefetch(gameId)]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
