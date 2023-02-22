import Image from "next/image";
import { Athlete } from "@/models/athlete";
import React, { useEffect, useState } from "react";
import { Color } from "@/models/color";

interface Props {
  athlete: Athlete;
  color: Color;
  idx: number;
}

export const AthleteCard: React.FC<Props> = (props) => {
  const [imgSrc, setImgSrc] = useState(
    require(`public/assets/athlete_cards/white/fallback.png`)
  );
  let isFallback = false;

  const [isInitial, setIsInitial] = useState(true);

  const recalculateImgSrc = () => {
    setIsInitial(false);
    try {
      setImgSrc(
        require(`public/assets/athlete_cards/${props.color}/${props.athlete.id}.png`)
      );
    } catch (err) {
      isFallback = true;
      setImgSrc(
        require(`public/assets/athlete_cards/${props.color}/fallback.png`)
      );
    }
  };

  useEffect(() => {
    recalculateImgSrc();
  }, []);

  useEffect(() => {
    setIsInitial(true);
    setTimeout(() => recalculateImgSrc(), 500);
  }, [props.color]);

  switch (props.idx) {
    case 0:
      return (
        <div
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[53%] `) +
            (isInitial ? `left-[35%] ` : `left-[5%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[25%] `)
          }
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
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[53%] `) +
            (isInitial ? `left-[35%] ` : `left-[65%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[60%] `)
          }
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
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[17%] `) +
            (isInitial ? `xl:top-[30%] ` : `xl:top-[10%] `) +
            (isInitial ? `left-[35%] ` : `left-[5%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[25%] `)
          }
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
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[17%] `) +
            (isInitial ? `xl:top-[30%] ` : `xl:top-[10%] `) +
            (isInitial ? `left-[35%] ` : `left-[65%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[60%] `)
          }
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
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[5%] `) +
            (isInitial ? `xl:top-[30%] ` : `xl:top-[1%] `) +
            (isInitial ? `left-[35%] ` : `left-[35%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[42.5%] `)
          }
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
        `absolute top-[56%] mx-auto w-full px-[10%] text-center font-bold uppercase transition-all duration-500 xl:text-xl ` +
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
