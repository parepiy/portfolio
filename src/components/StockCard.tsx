"use client";
import { Stock } from "@/types/stock";
import { fmtPrice } from "@/utils/format";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  stock: Stock;
  isSelected?: boolean;
  onClick: () => void;
}

export default function StockCard({ stock, isSelected, onClick }: Props) {
  const isUp = stock.change >= 0;
  const inBuy  = stock.currentPrice >= stock.buyZone.low  && stock.currentPrice <= stock.buyZone.high;
  const inSell = stock.currentPrice >= stock.sellZone.low && stock.currentPrice <= stock.sellZone.high;

  // Nearest resistance above current price
  const nearR = stock.resistanceLevels
    .filter((r) => r.level > stock.currentPrice)
    .sort((a, b) => a.level - b.level)[0];

  // Nearest support below current price
  const nearS = stock.supportLevels
    .filter((s) => s.level < stock.currentPrice)
    .sort((a, b) => b.level - a.level)[0];

  const rDiff = nearR ? ((nearR.level - stock.currentPrice) / stock.currentPrice) * 100 : null;
  const sDiff = nearS ? ((stock.currentPrice - nearS.level) / stock.currentPrice) * 100 : null;

  const SentIcon = stock.overallSentiment === "bullish" ? TrendingUp
    : stock.overallSentiment === "bearish" ? TrendingDown : Minus;

  return (
    <div onClick={onClick} className={`card card-hover p-3 select-none ${isSelected ? "card-active" : ""}`}>
      {/* Symbol + change */}
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{stock.symbol}</span>
        <span className={`text-xs font-semibold ${isUp ? "text-up" : "text-down"}`}>
          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Name + price */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs truncate max-w-[95px]" style={{ color: "var(--text-3)" }}>{stock.name}</span>
        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          {fmtPrice(stock.currentPrice, stock.currency)}
        </span>
      </div>

      {/* Resistance */}
      {nearR && (
        <div className="flex items-center justify-between text-xs mb-1 px-2 py-1 rounded-lg" style={{ background: "#fee2e2" }}>
          <span style={{ color: "var(--down)" }}>R&nbsp; {fmtPrice(nearR.level, stock.currency)}</span>
          <span style={{ color: "var(--down)" }}>+{rDiff?.toFixed(1)}%</span>
        </div>
      )}

      {/* Current price bar */}
      <div className="flex items-center gap-2 my-1 px-1">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--mint)" }}>
          {fmtPrice(stock.currentPrice, stock.currency)}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* Support */}
      {nearS && (
        <div className="flex items-center justify-between text-xs mt-1 mb-2 px-2 py-1 rounded-lg" style={{ background: "#dcfce7" }}>
          <span style={{ color: "var(--up)" }}>S&nbsp; {fmtPrice(nearS.level, stock.currency)}</span>
          <span style={{ color: "var(--up)" }}>-{sDiff?.toFixed(1)}%</span>
        </div>
      )}

      {/* Badges */}
      <div className="flex gap-1 mt-2 flex-wrap">
        <span className={`badge badge-${stock.overallSentiment}`}>
          <SentIcon size={10} />
          {stock.overallSentiment.charAt(0).toUpperCase() + stock.overallSentiment.slice(1)}
        </span>
        {inBuy  && <span className="badge badge-buy">Buy Zone</span>}
        {inSell && <span className="badge badge-sell">Sell Zone</span>}
      </div>
    </div>
  );
}
