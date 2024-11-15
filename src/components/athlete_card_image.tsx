import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Color } from "@/models/color";

interface Props {
  athleteId: number | bigint;
  athleteName: string;
  color: Color;
}

export const AthleteCardImage: React.FC<Props> = (props) => {
  const [imgSrc, setImgSrc] = useState(require(`public/images/athlete_cards/white/fallback.png`));
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    setTimeout(() => recalculateImgSrc(), 500);
  }, [props.color, props.athleteId]);

  const recalculateImgSrc = () => {
    try {
      setImgSrc(require(`public/images/athlete_cards/${props.color}/${props.athleteId}.png`));
      setIsFallback(false);
    } catch (err) {
      setIsFallback(true);
      setImgSrc(require(`public/images/athlete_cards/${props.color}/fallback.png`));
    }
  };

  useEffect(() => {
    recalculateImgSrc();
  }, []);

  return (
    <>
      <Image src={imgSrc} alt="Card do atleta"></Image>
      {isFallback && <FallbackName name={props.athleteName} color={props.color} />}
    </>
  );
};

const FallbackName: React.FC<{ name: string; color: Color }> = ({ name, color }) => {
  return (
    <div
      className={
        `absolute top-[56%] mx-auto w-full px-[10%] text-center font-bold uppercase transition-all duration-500 xl:text-xl ` +
        `${color === "white" ? "text-whiteCardText" : color === "yellow" ? "text-yellowCardText" : "text-white"}`
      }
    >
      {name}
    </div>
  );
};
