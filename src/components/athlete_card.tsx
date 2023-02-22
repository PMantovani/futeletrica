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
  let imgSrc;
  let isFallback = false;
  try {
    imgSrc = require(`public/assets/athlete_cards/${props.color}/${props.athlete.id}.png`);
  } catch (err) {
    isFallback = true;
    imgSrc = require(`public/assets/athlete_cards/${props.color}/fallback.png`);
  }

  switch (props.idx) {
    case 0:
      return (
        <div
          className={`absolute top-[53%] left-[5%] w-[30%] md:left-[25%] md:w-[15%]`}
        >
          <Image src={imgSrc} alt="Card do atleta"></Image>
          {isFallback && (
            <FallbackName name={props.athlete.name} color={props.color} />
          )}
        </div>
      );
    case 1:
      return (
        <div
          className={`absolute top-[53%] left-[65%] w-[30%] md:left-[60%] md:w-[15%]`}
        >
          <Image src={imgSrc} alt="Card do atleta"></Image>
          {isFallback && (
            <FallbackName name={props.athlete.name} color={props.color} />
          )}
        </div>
      );
    case 2:
      return (
        <div
          className={`absolute top-[17%] left-[5%] w-[30%] md:left-[25%] md:w-[15%] xl:top-[10%]`}
        >
          <Image src={imgSrc} alt="Card do atleta"></Image>
          {isFallback && (
            <FallbackName name={props.athlete.name} color={props.color} />
          )}
        </div>
      );

    case 3:
      return (
        <div
          className={`absolute top-[17%] left-[65%] w-[30%] md:left-[60%] md:w-[15%] xl:top-[10%]`}
        >
          <Image src={imgSrc} alt="Card do atleta"></Image>
          {isFallback && (
            <FallbackName name={props.athlete.name} color={props.color} />
          )}
        </div>
      );

    case 4:
      return (
        <div
          className={`absolute top-[5%] left-[35%] w-[30%] md:left-[42.5%] md:w-[15%] xl:top-[1%]`}
        >
          <Image src={imgSrc} alt="Card do atleta"></Image>
          {isFallback && (
            <FallbackName name={props.athlete.name} color={props.color} />
          )}
        </div>
      );
  }
  return <></>;
};

const FallbackName: React.FC<{ name: string; color: Color }> = ({
  name,
  color,
}) => {
  return (
    <div
      className={
        `absolute top-[56%] mx-auto w-full px-[10%] text-center font-bold uppercase xl:text-xl ` +
        `${
          color === "white"
            ? "text-whiteCardText"
            : color === "yellow"
            ? "text-yellowCardText"
            : "text-white"
        }`
      }
    >
      {name}
    </div>
  );
};
