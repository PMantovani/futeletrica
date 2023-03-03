import { AthleteCard } from "@/components/athlete_card";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { Roster } from "@/models/roster";
import { ColorObj, colors } from "@/models/color";
import { Pill } from "@/components/pill";
import { useState } from "react";

export default function Home(props: { rosters: Roster[] }) {
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
        <div className="flex items-center p-4">
          <Image
            alt="Logo do Fut Elétrica 2013"
            src={logo}
            width="56"
            height="67"
          />
          <h1 className=" ml-4 text-2xl text-yellow">Fut Elétrica 2013</h1>
        </div>
        <div className="mx-auto text-xl text-yellow">
          Escalação do dia 04/03/2023
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

export async function getServerSideProps() {
  const rosters = (
    await axios.get<Roster[]>(`${process.env.BASE_URL}/api/roster`)
  ).data;
  return { props: { rosters: rosters } };
}
