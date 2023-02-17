import { AthleteCard } from "@/components/athlete_card";
import { Athlete } from "@/models/athlete";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import logo from "../../public/assets/logo.png";
import field from "../../public/assets/field.png";
import { Rooster } from "@/models/rooster";
import { ColorObj, colors } from "@/models/color";
import { Pill } from "@/components/pill";
import { useState } from "react";

export default function Home(props: { athletes: Athlete[] }) {
  const [selectedColor, setSelectedColor] = useState(colors[0] as ColorObj);

  return (
    <>
      <Head>
        <title>FutElétrica 2013</title>
        <meta name="description" content="Fute elétrica 2013" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          Escalação do dia 18/02/2023
        </div>
        <div className="mt-8 flex justify-center">
          {colors.map((color, idx) => (
            <div className="mx-1">
              <Pill
                key={idx}
                isSelected={selectedColor === colors[idx]}
                onClick={() => setSelectedColor(colors[idx])}
              >
                {color.label}
              </Pill>
            </div>
          ))}
        </div>
        <div></div>
        <div className="soccer-field m-auto mt-6 flex h-full w-full xl:w-8/12">
          <div className="relative w-full">
            {props.athletes.map((athlete, idx) => (
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

// This gets called on every request
export async function getServerSideProps() {
  const roosters = (
    await axios.get<Rooster[]>("http://localhost:3000/api/rooster")
  ).data;
  return { props: { athletes: roosters[0].athletes } };
}
