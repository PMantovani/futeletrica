import { PropsWithChildren } from "react";

export const Button: React.FC<
  PropsWithChildren<{ onClick?: () => void; className?: string }>
> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`m-2 rounded-lg border border-solid border-yellow p-3 text-yellow hover:bg-yellow hover:text-neutral-900 ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </button>
  );
};
