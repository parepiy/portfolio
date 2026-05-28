"use client";
import { Stock } from "@/types/stock";
import PriceChart from "./PriceChart";
import NewsCard from "./NewsCard";
import { TrendingUp, TrendingDown, Minus, Target, Zap, ArrowLeft } from "lucide-react";

interface Props {
  stock: Stock;
  onBack: () => void;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-dim mb-1">{label}</div>
      <div className="font-semibold text-sm" style={{ color: "#ecfdf5" }}>{value}</div>
      {sub && <div className="text-xs mt-0.5 text-dim">{sub}</div>}
    </div>
  );
}

function LevelRow({ label, level, currentPrice, type }: { label: string; level: number; currentPrice: number; type: "support" | "resistance" }) {
  const diff = ((currentPrice - level) / level) * 100;
  const isSup = type === "support";
  return (
    <div className="flex items-center justify-between text-xs py-2 border-b last:border-0" style={{ borderColor: "rgba(110,231,183,0.08)" }}>
      <span className="text-dim">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-medium" style={{ color: isSup ? "#4ade80" : "#fb7185" }}>${level.toFixed(2)}</span>
        <span style={{ color: isSup ? (diff > 0 ? "#4ade80" : "rgba(167,243,208,0.4)") : (diff < 0 ? "#fb7185" : "rgba(167,243,208,0.4)") }}>
          {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function ZoneBanner({ stock }: { stock: Stock }) {
  const p = stock.currentPrice;
  const inBuy = p >= stock.buyZone.low && p <= stock.buyZone.high;
  const inSell = p >= stock.sellZone.low && p <= stock.sellZone.high;
  const belowBuy = p < stock.buyZone.low;
  const aboveSell = p > stock.sellZone.high;

  let label = "Watch — Between Zones";
  let color = "#fcd34d";
  let bg = "rgba(252,211,77,0.08)";
  let border = "rgba(252,211,77,0.2)";
  let desc = "Price is between buy and sell zones. Monitor for direction.";

  if (inBuy)    { label = "Buy Zone — Consider Buying";     color = "#4ade80"; bg = "rgba(74,222,128,0.08)"; border = "rgba(74,222,128,0.25)"; desc = "Price is in the recommended buy zone. Risk/reward favorable."; }
  if (inSell)   { label = "Sell Zone — Consider Selling";   color = "#fb7185"; bg = "rgba(251,113,133,0.08)"; border = "rgba(251,113,133,0.25)"; desc = "Price is in the recommended sell zone. Consider taking profit."; }
  if (belowBuy) { label = "Below Buy Zone — High Risk";     color = "#fb923c"; bg = "rgba(251,146,60,0.08)"; border = "rgba(251,146,60,0.25)"; desc = "Price has broken below buy zone. Exercise caution."; }
  if (aboveSell){ label = "Above Sell Zone — Overbought";   color = "#c084fc"; bg = "rgba(192,132,252,0.08)"; border = "rgba(192,132,252,0.25)"; desc = "Price extended above sell zone."; }

  return (
    <div className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Target size={14} style={{ color }} />
        <span className="font-semibold text-sm" style={{ color }}>{label}</span>
      </div>
      <p className="text-xs mb-3" style={{ color: `${color}99` }}>{desc}</p>
      <div className="flex gap-5 text-xs" style={{ color }}>
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

function SentimentMeter({ stock }: { stock: Stock }) {
  const total = stock.news.length;
  const bullN = stock.news.filter((n) => n.sentiment === "bullish").length;
  const bearN = stock.news.filter((n) => n.sentiment === "bearish").length;
  const avg = stock.news.reduce((s, n) => s + n.sentimentScore, 0) / total;

  const Icon = avg > 0.2 ? TrendingUp : avg < -0.2 ? TrendingDown : Minus;
  const color = avg > 0.2 ? "#4ade80" : avg < -0.2 ? "#fb7185" : "#fcd34d";
  const label = avg > 0.2 ? "Bullish Trend" : avg < -0.2 ? "Bearish Trend" : "Neutral Trend";

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={13} style={{ color: "#fcd34d" }} />
        <span className="text-sm font-semibold text-mint">News Sentiment</span>
      </div>
      <div className="flex items-center gap-2 mb-3" style={{ color }}>
        <Icon size={18} />
        <span className="font-bold">{label}</span>
        <span className="text-sm opacity-60">({(avg * 100).toFixed(0)}%)</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-2 mb-2">
        <div style={{ width: `${(bullN / total) * 100}%`, background: "#4ade80" }} />
        <div style={{ width: `${((total - bullN - bearN) / total) * 100}%`, background: "#fcd34d" }} />
        <div style={{ width: `${(bearN / total) * 100}%`, background: "#fb7185" }} />
      </div>
      <div className="flex justify-between text-xs">
        <span style={{ color: "#4ade80" }}>{bullN} Bullish</span>
        <span style={{ color: "#fb7185" }}>{bearN} Bearish</span>
      </div>
    </div>
  );
}

export default function StockDetail({ stock, onBack }: Props) {
  const isUp = stock.change >= 0;
  const fromATH = ((stock.currentPrice - stock.ath) / stock.ath) * 100;
  const fromATL = ((stock.currentPrice - stock.atl) / stock.atl) * 100;

  const fmtCap = (n: number) => n >= 1e12 ? `$${(n / 1e12).toFixed(2)}T` : n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`;
  const fmtVol = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${(n / 1e3).toFixed(0)}K`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid rgba(110,231,183,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 rounded-xl transition-colors" style={{ background: "rgba(110,231,183,0.1)", color: "#6ee7b7" }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg" style={{ color: "#ecfdf5" }}>{stock.symbol}</span>
              <span className="text-sm text-dim">{stock.name}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-2xl" style={{ color: "#ecfdf5" }}>${stock.currentPrice.toFixed(2)}</span>
              <span className={`text-sm font-semibold ${isUp ? "text-up" : "text-down"}`}>
                {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-lg text-dim" style={{ background: "rgba(167,243,208,0.06)", border: "1px solid rgba(110,231,183,0.14)" }}>
            {stock.sector}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 pt-4">
        <ZoneBanner stock={stock} />
        <PriceChart stock={stock} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="ATH" value={`$${stock.ath}`} sub={`${fromATH.toFixed(1)}%`} />
          <Stat label="ATL" value={`$${stock.atl}`} sub={`${fromATL > 999 ? ">999" : fromATL.toFixed(0)}%`} />
          <Stat label="52W High" value={`$${stock.week52High}`} sub={`Low $${stock.week52Low}`} />
          <Stat label="Mkt Cap" value={fmtCap(stock.marketCap)} />
          <Stat label="Volume" value={fmtVol(stock.volume)} sub={`Avg ${fmtVol(stock.avgVolume)}`} />
          <Stat label="P/E" value={`${stock.pe}x`} sub={`EPS $${stock.eps}`} />
          <Stat label="Target" value={`$${stock.analystTarget}`} sub={`${(((stock.analystTarget - stock.currentPrice) / stock.currentPrice) * 100).toFixed(1)}% up`} />
          <Stat label="Prev Close" value={`$${stock.previousClose}`} />
          <Stat label="ATH Date" value={stock.athDate.slice(0, 7)} sub={`ATL ${stock.atlDate.slice(0, 7)}`} />
        </div>

        {/* Support & Resistance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="text-sm font-semibold text-mint mb-3">Support</div>
            {stock.supportLevels.map((s, i) => (
              <LevelRow key={i} label={s.strength.charAt(0).toUpperCase() + s.strength.slice(1)} level={s.level} currentPrice={stock.currentPrice} type="support" />
            ))}
          </div>
          <div className="card p-4">
            <div className="text-sm font-semibold text-mint mb-3">Resistance</div>
            {stock.resistanceLevels.map((r, i) => (
              <LevelRow key={i} label={r.strength.charAt(0).toUpperCase() + r.strength.slice(1)} level={r.level} currentPrice={stock.currentPrice} type="resistance" />
            ))}
          </div>
        </div>

        <SentimentMeter stock={stock} />

        <div>
          <div className="text-sm font-semibold text-mint mb-3">Latest News</div>
          <div className="space-y-3">
            {stock.news.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
