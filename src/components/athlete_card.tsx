import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Color } from "@/models/color";
import { Athlete } from "@prisma/client";
import { AthleteCardImage } from "./athlete_card_image";

interface Props {
  athlete: Athlete;
  color: Color;
  idx: number;
}

export const AthleteCard: React.FC<Props> = (props) => {
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    setIsInitial(true);
    setTimeout(() => {
      setIsInitial(false);
    }, 500);
  }, [props.color]);

  const colorInCard = props.athlete.position === "GOL" ? "neutral" : props.color;

  switch (props.idx) {
    case 0:
      return (
        <div
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[63%] `) +
            (isInitial ? `left-[35%] ` : `left-[35%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[42.5%] `)
          }
        >
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );
    case 1:
      return (
        <div
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[53%] `) +
            (isInitial ? `left-[35%] ` : `left-[5%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[25%] `)
          }
        >
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );
    case 2:
      return (
        <div
          className={
            `absolute w-[30%] transition-all duration-500 md:w-[15%] ` +
            (isInitial ? `top-[30%] ` : `top-[53%] `) +
            (isInitial ? `left-[35%] ` : `left-[65%] `) +
            (isInitial ? `md:left-[42.5%] ` : `md:left-[60%] `)
          }
        >
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );
    case 3:
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
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );

    case 4:
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
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );

    case 5:
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
          <AthleteCardImage athleteId={props.athlete.id} athleteName={props.athlete.name} color={colorInCard} />
        </div>
      );
  }
  return <></>;
};
