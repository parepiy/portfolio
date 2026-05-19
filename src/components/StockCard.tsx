"use client";

import { Stock } from "@/types/stock";
import StockMiniChart from "./StockMiniChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMemo } from "react";

interface Props {
  stock: Stock;
  isSelected: boolean;
  onClick: () => void;
}

function SentimentBadge({ sentiment }: { sentiment: Stock["overallSentiment"] }) {
  const config = {
    bullish: { icon: TrendingUp, text: "Bullish", cls: "text-green-400 bg-green-400/10 border-green-400/30" },
    bearish: { icon: TrendingDown, text: "Bearish", cls: "text-red-400 bg-red-400/10 border-red-400/30" },
    neutral: { icon: Minus, text: "Neutral", cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  }[sentiment];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${config.cls}`}>
      <Icon size={11} />
      {config.text}
    </span>
  );
}

export default function StockCard({ stock, isSelected, onClick }: Props) {
  const isUp = stock.change >= 0;
  const inBuyZone = stock.currentPrice >= stock.buyZone.low && stock.currentPrice <= stock.buyZone.high;
  const inSellZone = stock.currentPrice >= stock.sellZone.low && stock.currentPrice <= stock.sellZone.high;

  const zoneLabel = useMemo(() => {
    if (inBuyZone) return <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">Buy Zone</span>;
    if (inSellZone) return <span className="text-xs text-red-400 font-semibold bg-red-400/10 px-2 py-0.5 rounded-full">Sell Zone</span>;
    return null;
  }, [inBuyZone, inSellZone]);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:border-blue-500/50 ${
        isSelected
          ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/8"
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">{stock.symbol}</span>
            {zoneLabel}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">{stock.name}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-white">${stock.currentPrice.toFixed(2)}</div>
          <div className={`text-xs font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div className="my-2">
        <StockMiniChart stock={stock} />
      </div>
      <div className="flex items-center justify-between mt-1">
        <SentimentBadge sentiment={stock.overallSentiment} />
        <span className="text-xs text-gray-500">{stock.sector}</span>
      </div>
    </div>
  );
}
