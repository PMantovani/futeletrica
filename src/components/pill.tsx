import React, { PropsWithChildren } from "react";

interface Props {
  isSelected?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Pill: React.FC<PropsWithChildren<Props>> = (props) => {
  return (
    <button
      className={`cursor-pointer rounded-full border-2 border-solid border-yellow py-2 px-4 text-yellow ${
        props.isSelected ? "bg-yellow text-neutral-800 " : ""
      } ${props.className ?? ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
