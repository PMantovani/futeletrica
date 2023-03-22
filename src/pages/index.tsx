import axios from "axios";
import Head from "next/head";
import { Roster } from "@/models/roster";
import { Game } from "@/models/game";
import { formatDate } from "@/formatters/date_formatter";
import Link from "next/link";
import { Button } from "@/components/button";
import { Header } from "@/components/header";

export default function Home(props: { games: Game[] }) {
  const sortedGames = [...props.games].sort((a, b) =>
    b.game_date.localeCompare(a.game_date)
  );
  return (
    <>
      <Head>
        <title>FutElétrica 2013</title>
        <meta name="description" content="Fut Elétrica 2013" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Fut Elétrica 2013" />
        <meta
          property="og:image"
          content="https://futeletrica.vercel.app/images/logo.png"
        />
        <meta
          property="og:description"
          content="Confira a escalação do maior time do sul do mundo!"
        />
        <meta property="og:image:width" content="457" />
        <meta property="og:image:height" content="545" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-yellow">
            Jogos do Fut Elétrica
          </h2>
          {sortedGames.map((game, idx) => (
            <Button key={idx}>
              <Link href={`/jogo/${game.id}`}>
                {"Jogo do dia " + formatDate(game.game_date)}
              </Link>
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const games = (
    await axios.get<Roster[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/game`)
  ).data;
  return { props: { games: games } };
}
