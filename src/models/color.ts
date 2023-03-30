import { z } from "zod";

export const colors: { id: Color; label: string }[] = [
  { id: "white", label: "Branco" },
  { id: "blue", label: "Azul" },
  { id: "yellow", label: "Amarelo" },
];

export const colorLabelsMap = colors.reduce(
  (prev, cur) => ({ ...prev, [cur.id]: cur.label }),
  {} as { [color: string]: string }
);

export type ColorObj = (typeof colors)[number];

export const colorSchema = z.enum(["white", "blue", "yellow"]);
export type Color = z.infer<typeof colorSchema>;
