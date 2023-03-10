import { AthleteCard } from "@/components/athlete_card";
import axios from "axios";
import Image from "next/image";
import logo from "public/images/logo.png";
import { Roster } from "@/models/roster";
import { ColorObj, colors } from "@/models/color";
import { Pill } from "@/components/pill";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Header } from "@/components/header";
import { Game } from "@/models/game";
import { formatDate } from "@/formatters/date_formatter";

export default function Home(props: { rosters: Roster[]; game: Game }) {
  const [selectedColor, setSelectedColor] = useState(colors[0] as ColorObj);

  const athletes = props.rosters.find(
    (i) => i.color === selectedColor.id
  )?.athletes;
  athletes?.sort(
    (a, b) =>
      b.position.localeCompare(a.position) || a.name.localeCompare(b.name)
  );

  const calculateRosterAvg = () =>
    (
      (athletes?.reduce((prev, cur) => prev + cur.rating, 0) ?? 0) /
      (athletes?.length ?? 1)
    ).toFixed(3);

  return (
    <>
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="mx-auto text-xl text-yellow">
          Escalação do dia {formatDate(props.game.game_date)}
        </div>
        <div className="mt-8 flex justify-center">
          {colors.map((color, idx) => (
            <div className="mx-1" key={idx}>
              <Pill
                isSelected={selectedColor === colors[idx]}
                onClick={() => setSelectedColor(colors[idx])}
              >
                {color.label}
              </Pill>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 text-yellow">
          Nota média do time: {calculateRosterAvg()}
        </div>
        <div className="soccer-field m-auto mt-6 flex h-full w-full xl:w-8/12">
          <div className="relative w-full">
            {athletes?.map((athlete, idx) => (
              <AthleteCard
                athlete={athlete}
                color={selectedColor.id}
                idx={idx}
                key={idx}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const rosters = (
    await axios.get<Roster[]>(
      `${process.env.BASE_URL}/api/game/${context.query.gameId}/roster`
    )
  ).data;
  const game = (
    await axios.get<Game>(
      `${process.env.BASE_URL}/api/game/${context.query.gameId}`
    )
  ).data;
  return { props: { rosters: rosters, game } };
}
