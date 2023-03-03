import { PropsWithChildren } from "react";

export const Button: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <button className="m-2 rounded-lg border border-solid border-yellow p-3 text-yellow hover:bg-yellow hover:text-neutral-900">
      {props.children}
    </button>
  );
};
