"use client";
import { Stock } from "@/types/stock";
import StockMiniChart from "./StockMiniChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  stock: Stock;
  isSelected?: boolean;
  onClick: () => void;
}

export default function StockCard({ stock, isSelected, onClick }: Props) {
  const isUp = stock.change >= 0;
  const inBuy = stock.currentPrice >= stock.buyZone.low && stock.currentPrice <= stock.buyZone.high;
  const inSell = stock.currentPrice >= stock.sellZone.low && stock.currentPrice <= stock.sellZone.high;

  const SentIcon = stock.overallSentiment === "bullish" ? TrendingUp : stock.overallSentiment === "bearish" ? TrendingDown : Minus;

  return (
    <div
      onClick={onClick}
      className={`card card-hover cursor-pointer p-3 ${isSelected ? "card-active" : ""}`}
    >
      {/* Row 1: symbol + price */}
      <div className="flex justify-between items-start mb-0.5">
        <span className="font-bold text-sm" style={{ color: "#ecfdf5" }}>{stock.symbol}</span>
        <span className="font-semibold text-sm" style={{ color: "#ecfdf5" }}>
          ${stock.currentPrice.toFixed(2)}
        </span>
      </div>

      {/* Row 2: name + change */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs truncate max-w-[100px]" style={{ color: "rgba(167,243,208,0.55)" }}>
          {stock.name}
        </span>
        <span className={`text-xs font-medium ${isUp ? "text-up" : "text-down"}`}>
          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Mini chart */}
      <StockMiniChart stock={stock} height={48} />

      {/* Badges */}
      <div className="flex gap-1 mt-2 flex-wrap">
        <span className={`badge badge-${stock.overallSentiment}`}>
          <SentIcon size={10} />
          {stock.overallSentiment.charAt(0).toUpperCase() + stock.overallSentiment.slice(1)}
        </span>
        {inBuy && <span className="badge badge-buy">Buy Zone</span>}
        {inSell && <span className="badge badge-sell">Sell Zone</span>}
      </div>
    </div>
  );
}
