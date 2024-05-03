import { Position } from "@prisma/client";

export function positionSort(a: Position, b: Position) {
  const positions = ["GOL", "ZAG", "VOL", "MEI", "ATA"];
  return positions.indexOf(a) - positions.indexOf(b);
}