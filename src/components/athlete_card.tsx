import Image from "next/image";
import { Athlete } from "@/models/athlete";
import React from "react";
import { Color } from "@/models/color";

interface Props {
  athlete: Athlete;
  color: Color;
  idx: number;
}

export const AthleteCard: React.FC<Props> = (props) => {
  const imgSrc = require(`public/assets/athlete_cards/${props.color}/${props.athlete.id}.png`);

  switch (props.idx) {
    case 0:
      return (
        <Image
          src={imgSrc}
          alt="Card do atleta"
          className={`absolute top-[53%] left-[5%] w-[30%] md:left-[25%] md:w-[15%]`}
        ></Image>
      );
    case 1:
      return (
        <Image
          src={imgSrc}
          alt="Card do atleta"
          className={`absolute top-[53%] left-[65%] w-[30%] md:left-[60%] md:w-[15%]`}
        ></Image>
      );
    case 2:
      return (
        <Image
          src={imgSrc}
          alt="Card do atleta"
          className={`absolute top-[17%] left-[5%] w-[30%] md:left-[25%] md:w-[15%] xl:top-[10%]`}
        ></Image>
      );

    case 3:
      return (
        <Image
          src={imgSrc}
          alt="Card do atleta"
          className={`absolute top-[17%] left-[65%] w-[30%] md:left-[60%] md:w-[15%] xl:top-[10%]`}
        ></Image>
      );

    case 4:
      return (
        <Image
          src={imgSrc}
          alt="Card do atleta"
          className={`absolute top-[5%] left-[35%] w-[30%] md:left-[42.5%] md:w-[15%] xl:top-[1%]`}
        ></Image>
      );
  }
  return <></>;
};
