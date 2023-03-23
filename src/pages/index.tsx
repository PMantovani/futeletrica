import { formatDate } from "@/formatters/date_formatter";
import Link from "next/link";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import { ssg } from "@/server/utils/ssg_helper";

export default function Home() {
  const allGamesQuery = trpc.game.findAll.useQuery();
  const sortedGames = [...(allGamesQuery.data ?? [])].sort((a, b) => b.game_date.localeCompare(a.game_date));
  return (
    <>
      <PageHead description="Confira a escalação do maior time do sul do mundo!" />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-yellow">Jogos do Fut Elétrica</h2>
          {sortedGames.map((game, idx) => (
            <Button key={idx}>
              <Link href={`/jogo/${game.id}`}>{"Jogo do dia " + formatDate(game.game_date)}</Link>
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await ssg.game.findAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
