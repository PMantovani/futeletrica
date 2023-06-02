import { formatDate } from "@/formatters/date_formatter";
import { Button } from "@/components/button";
import Link from "next/link";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { useGameAndResultsFromQueryParam } from "@/hooks/use-game-and-results";

export default function Home() {
  const { gameQuery, gameResultsQuery, gameIdNumber } = useGameAndResultsFromQueryParam();

  return (
    <>
      <PageHead description={`Confira os dados do jogo`} />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        {!gameQuery?.data || !gameResultsQuery?.data ? (
          <div className="mx-auto text-yellow">Carregando...</div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xl font-bold text-yellow">Jogo do dia {formatDate(gameQuery.data.gameDate)}</h2>

            <Link href={`/jogo/${gameIdNumber}/escalacao`}>
              <Button>Escalação</Button>
            </Link>
            {gameResultsQuery.data.length > 0 && (
              <Link href={`/jogo/${gameIdNumber}/resultados`}>
                <Button>Resultados</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </>
  );
}
