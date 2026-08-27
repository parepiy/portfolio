import { Currency } from "@/types/stock";

export function fmtPrice(price: number, currency: Currency): string {
  if (currency === "THB") return `฿${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

export function fmtLargeValue(value: number, currency: Currency): string {
  const sym = currency === "THB" ? "฿" : "$";
  if (value >= 1e12) return `${sym}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `${sym}${(value / 1e9).toFixed(1)}B`;
  return `${sym}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
