import React, { PropsWithChildren } from "react";

interface Props {
  isSelected?: boolean;
  onClick?: () => void;
}

export const Pill: React.FC<PropsWithChildren<Props>> = (props) => {
  return props.isSelected ? (
    <button
      className="cursor-pointer rounded-full border-2 border-solid border-yellow bg-yellow py-2 px-4"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  ) : (
    <button
      className="cursor-pointer rounded-full border-2 border-solid border-yellow py-2 px-4 text-yellow"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
