import { formatDate } from "@/formatters/date_formatter";
import Link from "next/link";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { trpc } from "@/utils/trpc";
import { ssg } from "@/server/utils/ssg_helper";
import { GetStaticProps } from "next";

export default function Home() {
  const allGamesQuery = trpc.game.findAll.useQuery();
  const sortedGames = [...(allGamesQuery.data ?? [])].sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime());
  return (
    <>
      <PageHead description="Confira a escalação do maior time do sul do mundo!" />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-yellow">Jogos do Fut Elétrica</h2>
          {sortedGames.map((game, idx) => (
            <Link href={`/jogo/${game.id}`}>
              <Button key={idx}>{"Jogo do dia " + formatDate(game.gameDate)}</Button>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await ssg.game.findAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};
