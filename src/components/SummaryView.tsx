"use client";
import { useState } from "react";
import { mockStocks } from "@/data/mockStocks";
import { Stock } from "@/types/stock";
import StockCard from "./StockCard";
import { Plus, X, Search, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  onSelect: (symbol: string) => void;
}

export default function SummaryView({ onSelect }: Props) {
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "NVDA", "TSLA", "MSFT", "META"]);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");

  const watched = watchlist.map((s) => mockStocks.find((m) => m.symbol === s)).filter(Boolean) as Stock[];
  const bullish = watched.filter((s) => s.overallSentiment === "bullish").length;
  const avgChange = watched.reduce((sum, s) => sum + s.changePercent, 0) / watched.length;
  const gainers = watched.filter((s) => s.change > 0).length;

  const available = mockStocks
    .filter((s) => !watchlist.includes(s.symbol))
    .filter((s) => s.symbol.includes(query.toUpperCase()) || s.name.toLowerCase().includes(query.toLowerCase()));

  const add = (sym: string) => {
    setWatchlist((prev) => [...prev, sym]);
    setAddOpen(false);
    setQuery("");
  };
  const remove = (sym: string) => setWatchlist((prev) => prev.filter((s) => s !== sym));

  return (
    <div className="flex flex-col h-full">
      {/* Market overview bar */}
      <div className="px-4 pt-4 pb-3 flex gap-3 overflow-x-auto no-scrollbar shrink-0">
        <div className="card px-3 py-2 shrink-0 flex items-center gap-2">
          {avgChange >= 0 ? <TrendingUp size={14} className="text-up" /> : <TrendingDown size={14} className="text-down" />}
          <div>
            <div className="text-xs text-dim">Avg Change</div>
            <div className={`text-sm font-bold ${avgChange >= 0 ? "text-up" : "text-down"}`}>
              {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="card px-3 py-2 shrink-0">
          <div className="text-xs text-dim">Bullish</div>
          <div className="text-sm font-bold text-mint">{bullish}/{watched.length}</div>
        </div>
        <div className="card px-3 py-2 shrink-0">
          <div className="text-xs text-dim">Gainers</div>
          <div className="text-sm font-bold text-up">{gainers}/{watched.length}</div>
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between px-4 pb-3 shrink-0">
        <span className="text-xs font-semibold text-dim uppercase tracking-wider">
          Watchlist ({watchlist.length})
        </span>
        <button
          onClick={() => setAddOpen(!addOpen)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "rgba(110,231,183,0.12)", color: "#6ee7b7", border: "1px solid rgba(110,231,183,0.25)" }}
        >
          <Plus size={13} /> Add Stock
        </button>
      </div>

      {/* Add stock dropdown */}
      {addOpen && (
        <div className="mx-4 mb-3 card p-3 shrink-0">
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim" />
            <input
              autoFocus
              type="text"
              placeholder="Search symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg outline-none"
              style={{ background: "rgba(167,243,208,0.08)", border: "1px solid rgba(110,231,183,0.2)", color: "#ecfdf5" }}
            />
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {available.length === 0 ? (
              <p className="text-xs text-dim text-center py-2">No stocks to add</p>
            ) : available.map((s) => (
              <button
                key={s.symbol}
                onClick={() => add(s.symbol)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: "#ecfdf5" }}>{s.symbol}</span>
                  <span className="text-xs text-dim">{s.name}</span>
                </div>
                <span className={`text-xs font-medium ${s.changePercent >= 0 ? "text-up" : "text-down"}`}>
                  {s.changePercent >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {watched.map((stock) => (
            <div key={stock.symbol} className="relative group">
              <StockCard stock={stock} onClick={() => onSelect(stock.symbol)} />
              <button
                onClick={(e) => { e.stopPropagation(); remove(stock.symbol); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "rgba(251,113,133,0.2)" }}
              >
                <X size={10} style={{ color: "#fb7185" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
