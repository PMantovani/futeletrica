export function roundToDecimalPlaces(num: number, decimalPlaces = 2) {
  return parseFloat(num.toFixed(decimalPlaces));
}

export function getCssColorVariable(name: string) {
  const hexWithShorthand = getComputedStyle(document.documentElement).getPropertyValue(name);
  if (hexWithShorthand.length === 4) {
    return (
      "#" +
      hexWithShorthand[1] +
      hexWithShorthand[1] +
      hexWithShorthand[2] +
      hexWithShorthand[2] +
      hexWithShorthand[3] +
      hexWithShorthand[3]
    );
  }
  return hexWithShorthand;
}
