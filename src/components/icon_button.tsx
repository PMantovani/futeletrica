import React, { PropsWithChildren } from "react";

export const IconButton: React.FC<PropsWithChildren<{ className?: string; onClick: () => void }>> = (props) => {
  return (
    <button
      className={`h-8 w-8 rounded-full hover:bg-neutral-600 focus:bg-neutral-600 ${props.className ?? ""}`}
      onClick={props.onClick}
    >
      <div className="m-auto h-4 w-4">{props.children}</div>
    </button>
  );
};
