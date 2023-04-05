export function roundToDecimalPlaces(num: number, decimalPlaces = 2) {
  return parseFloat(num.toFixed(decimalPlaces));
}
