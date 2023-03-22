import { PropsWithChildren } from "react";

export const Main: React.FC<PropsWithChildren> = (props) => (
  <main className="flex h-screen flex-col overflow-auto bg-neutral-900 text-yellow">
    {props.children}
  </main>
);
