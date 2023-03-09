import axios from "axios";
import { Roster } from "@/models/roster";
import { Game } from "@/models/game";
import { formatDate } from "@/formatters/date_formatter";
import { GetServerSidePropsContext } from "next";
import { Button } from "@/components/button";
import Link from "next/link";
import { Header } from "@/components/header";

export default function Home(props: { game: Game; hasResults: boolean }) {
  return (
    <>
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-yellow">
            Jogo do dia {formatDate(props.game.game_date)}
          </h2>
          <Button>
            <Link href={`/jogo/${props.game.id}/escalacao`}>Escalação</Link>
          </Button>
          {props.hasResults && (
            <Button>
              <Link href={`/jogo/${props.game.id}/resultados`}>Resultados</Link>
            </Button>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const gameId = context.query.gameId;

  const game = (
    await axios.get<Roster[]>(`${process.env.BASE_URL}/api/game/${gameId}`)
  ).data;

  const results = (
    await axios.get<Roster[]>(
      `${process.env.BASE_URL}/api/game/${gameId}/results`
    )
  ).data;

  return { props: { game: game, hasResults: results.length > 0 } };
}
