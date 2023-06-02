import { formatDate } from "@/formatters/date_formatter";
import Link from "next/link";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { trpc } from "@/utils/trpc";

export default function Jogos() {
  const allGamesQuery = trpc.game.findAll.useQuery();
  const sortedGames = [...(allGamesQuery.data ?? [])].sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime());
  return (
    <>
      <PageHead description="Confira os jogos do maior time do sul do mundo!" />
      <main className="flex h-screen flex-col bg-neutral-900 text-yellow">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold">Jogos do Fut Elétrica</h2>
          {allGamesQuery.isLoading && <p>Carregando...</p>}
          {sortedGames.map((game, idx) => (
            <Link key={idx} href={`/jogo/${game.id}`}>
              <Button>{"Jogo do dia " + formatDate(game.gameDate)}</Button>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
