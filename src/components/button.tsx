import { PropsWithChildren } from "react";

export const Button: React.FC<PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = (props) => {
  return (
    <button
      {...props}
      className={`m-2 rounded-lg border border-solid border-yellow p-3 text-yellow 
      hover:bg-yellow hover:text-neutral-900 
      disabled:cursor-not-allowed disabled:border-yellowCardText disabled:text-yellowCardText
      disabled:hover:bg-inherit  ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
};
