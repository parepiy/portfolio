"use client";

import { Stock } from "@/types/stock";
import PriceChart from "./PriceChart";
import NewsCard from "./NewsCard";
import { TrendingUp, TrendingDown, Minus, Target, ShieldCheck, Zap } from "lucide-react";

interface Props {
  stock: Stock;
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="font-semibold text-white text-sm">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function LevelBar({ label, level, currentPrice, type }: { label: string; level: number; currentPrice: number; type: "support" | "resistance" }) {
  const diff = ((currentPrice - level) / level) * 100;
  const isSupport = type === "support";
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
      <span className="text-gray-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`font-medium ${isSupport ? "text-green-400" : "text-red-400"}`}>${level.toFixed(2)}</span>
        <span className={`text-xs ${isSupport ? (diff > 0 ? "text-green-500" : "text-gray-500") : (diff < 0 ? "text-red-500" : "text-gray-500")}`}>
          {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function SentimentMeter({ stock }: { stock: Stock }) {
  const bullishCount = stock.news.filter(n => n.sentiment === "bullish").length;
  const bearishCount = stock.news.filter(n => n.sentiment === "bearish").length;
  const total = stock.news.length;
  const avgScore = stock.news.reduce((sum, n) => sum + n.sentimentScore, 0) / total;

  const Icon = avgScore > 0.2 ? TrendingUp : avgScore < -0.2 ? TrendingDown : Minus;
  const color = avgScore > 0.2 ? "text-green-400" : avgScore < -0.2 ? "text-red-400" : "text-yellow-400";
  const label = avgScore > 0.2 ? "Bullish Trend" : avgScore < -0.2 ? "Bearish Trend" : "Neutral Trend";

  const bullPct = (bullishCount / total) * 100;
  const bearPct = (bearishCount / total) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-yellow-400" />
        <h3 className="text-sm font-semibold text-gray-300">News Sentiment</h3>
      </div>
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon size={20} />
        <span className="font-bold text-base">{label}</span>
        <span className="text-sm opacity-70">({(avgScore * 100).toFixed(0)}%)</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-2 mb-2">
        <div className="bg-green-500" style={{ width: `${bullPct}%` }} />
        <div className="bg-yellow-500" style={{ width: `${100 - bullPct - bearPct}%` }} />
        <div className="bg-red-500" style={{ width: `${bearPct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span className="text-green-400">{bullishCount} Bullish</span>
        <span className="text-red-400">{bearishCount} Bearish</span>
      </div>
    </div>
  );
}

function ZoneIndicator({ stock }: { stock: Stock }) {
  const price = stock.currentPrice;
  const inBuy = price >= stock.buyZone.low && price <= stock.buyZone.high;
  const inSell = price >= stock.sellZone.low && price <= stock.sellZone.high;
  const belowBuy = price < stock.buyZone.low;
  const aboveSell = price > stock.sellZone.high;

  let status = { label: "Watch — Between Zones", cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", desc: "Price is between buy and sell zones. Monitor for direction." };
  if (inBuy) status = { label: "Buy Zone — Consider Buying", cls: "text-green-400 bg-green-400/10 border-green-400/20", desc: "Price is in the recommended buy zone. Risk/reward favorable." };
  if (inSell) status = { label: "Sell Zone — Consider Selling", cls: "text-red-400 bg-red-400/10 border-red-400/20", desc: "Price is in the recommended sell zone. Consider taking profit." };
  if (belowBuy) status = { label: "Below Buy Zone — High Risk", cls: "text-orange-400 bg-orange-400/10 border-orange-400/20", desc: "Price has broken below buy zone. Exercise caution." };
  if (aboveSell) status = { label: "Above Sell Zone — Overbought", cls: "text-purple-400 bg-purple-400/10 border-purple-400/20", desc: "Price extended above sell zone. Very overbought territory." };

  return (
    <div className={`border rounded-xl p-4 ${status.cls}`}>
      <div className="flex items-center gap-2 mb-1">
        <Target size={14} />
        <span className="font-semibold text-sm">{status.label}</span>
      </div>
      <p className="text-xs opacity-80">{status.desc}</p>
      <div className="flex gap-4 mt-3 text-xs">
        <div>
          <div className="opacity-60 mb-0.5">Buy Zone</div>
          <div className="font-medium">${stock.buyZone.low} – ${stock.buyZone.high}</div>
        </div>
        <div>
          <div className="opacity-60 mb-0.5">Sell Zone</div>
          <div className="font-medium">${stock.sellZone.low} – ${stock.sellZone.high}</div>
        </div>
      </div>
    </div>
  );
}

export default function StockDetail({ stock }: Props) {
  const isUp = stock.change >= 0;
  const fromATH = ((stock.currentPrice - stock.ath) / stock.ath) * 100;
  const fromATL = ((stock.currentPrice - stock.atl) / stock.atl) * 100;

  const formatMarketCap = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    return `$${(n / 1e6).toFixed(0)}M`;
  };

  const formatVol = (n: number) => {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    return `${(n / 1e3).toFixed(0)}K`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>
            <span className="text-gray-400 text-sm">{stock.name}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">${stock.currentPrice.toFixed(2)}</span>
            <span className={`text-base font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
              {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
          <ShieldCheck size={12} />
          <span>{stock.sector}</span>
        </div>
      </div>

      {/* Zone Indicator */}
      <ZoneIndicator stock={stock} />

      {/* Chart */}
      <PriceChart stock={stock} />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="ATH" value={`$${stock.ath}`} sub={`${fromATH.toFixed(1)}% from ATH`} />
        <StatBox label="ATL" value={`$${stock.atl}`} sub={`${fromATL > 999 ? ">999" : fromATL.toFixed(0)}% from ATL`} />
        <StatBox label="52W High/Low" value={`$${stock.week52High}`} sub={`Low: $${stock.week52Low}`} />
        <StatBox label="Market Cap" value={formatMarketCap(stock.marketCap)} />
        <StatBox label="Volume" value={formatVol(stock.volume)} sub={`Avg: ${formatVol(stock.avgVolume)}`} />
        <StatBox label="P/E Ratio" value={`${stock.pe}x`} sub={`EPS: $${stock.eps}`} />
        <StatBox label="Analyst Target" value={`$${stock.analystTarget}`} sub={`${(((stock.analystTarget - stock.currentPrice) / stock.currentPrice) * 100).toFixed(1)}% upside`} />
        <StatBox label="Prev Close" value={`$${stock.previousClose}`} />
        <StatBox label="ATH Date" value={stock.athDate} sub={`ATL: ${stock.atlDate}`} />
      </div>

      {/* Support & Resistance */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Support Levels</h3>
          {stock.supportLevels.map((s, i) => (
            <LevelBar
              key={i}
              label={`${s.strength.charAt(0).toUpperCase() + s.strength.slice(1)} Support`}
              level={s.level}
              currentPrice={stock.currentPrice}
              type="support"
            />
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Resistance Levels</h3>
          {stock.resistanceLevels.map((r, i) => (
            <LevelBar
              key={i}
              label={`${r.strength.charAt(0).toUpperCase() + r.strength.slice(1)} Resistance`}
              level={r.level}
              currentPrice={stock.currentPrice}
              type="resistance"
            />
          ))}
        </div>
      </div>

      {/* Sentiment */}
      <SentimentMeter stock={stock} />

      {/* News */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Latest News</h3>
        <div className="space-y-3">
          {stock.news.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
