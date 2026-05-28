"use client";
import { useState, useEffect } from "react";
import { mockStocks } from "@/data/mockStocks";
import { Stock } from "@/types/stock";
import StockCard from "./StockCard";
import { Plus, X, Search, TrendingUp, TrendingDown } from "lucide-react";

const DEFAULT_WATCHLIST = ["AAPL", "NVDA", "TSLA", "MSFT", "META"];

interface Props { onSelect: (symbol: string) => void; }

export default function SummaryView({ onSelect }: Props) {
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [loaded, setLoaded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("stockwatch_watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Persist on every change (after initial load)
  useEffect(() => {
    if (loaded) localStorage.setItem("stockwatch_watchlist", JSON.stringify(watchlist));
  }, [watchlist, loaded]);

  const watched = watchlist
    .map((s) => mockStocks.find((m) => m.symbol === s))
    .filter(Boolean) as Stock[];

  const bullish  = watched.filter((s) => s.overallSentiment === "bullish").length;
  const avgChg   = watched.length ? watched.reduce((sum, s) => sum + s.changePercent, 0) / watched.length : 0;
  const gainers  = watched.filter((s) => s.change > 0).length;

  const available = mockStocks
    .filter((s) => !watchlist.includes(s.symbol))
    .filter((s) =>
      s.symbol.includes(query.toUpperCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
    );

  const add    = (sym: string) => { setWatchlist((p) => [...p, sym]); setAddOpen(false); setQuery(""); };
  const remove = (sym: string) => setWatchlist((p) => p.filter((s) => s !== sym));

  return (
    <div className="flex flex-col h-full">
      {/* Market overview chips */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
        {[
          {
            label: "Avg Change",
            value: `${avgChg >= 0 ? "+" : ""}${avgChg.toFixed(2)}%`,
            icon: avgChg >= 0 ? TrendingUp : TrendingDown,
            color: avgChg >= 0 ? "var(--up)" : "var(--down)",
            bg:    avgChg >= 0 ? "var(--up-bg)" : "var(--down-bg)",
          },
          { label: "Bullish",  value: `${bullish}/${watched.length}`,  icon: TrendingUp,   color: "var(--mint)", bg: "var(--mint-bg)" },
          { label: "Gainers",  value: `${gainers}/${watched.length}`,  icon: TrendingUp,   color: "var(--up)",   bg: "var(--up-bg)"  },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0" style={{ background: bg }}>
            <Icon size={13} style={{ color }} />
            <div>
              <div className="text-xs" style={{ color, opacity: 0.7 }}>{label}</div>
              <div className="text-sm font-bold" style={{ color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <span className="text-xs font-semibold text-faint uppercase tracking-wider">
          Watchlist ({watchlist.length})
        </span>
        <button
          onClick={() => setAddOpen(!addOpen)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
          style={{ background: "var(--mint-bg)", color: "var(--mint)" }}
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {/* Add stock dropdown */}
      {addOpen && (
        <div className="mx-4 mb-2 card p-3 shrink-0">
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
            <input
              autoFocus
              type="text"
              placeholder="Search symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-mint w-full text-xs pl-8 pr-3 py-2"
            />
          </div>
          <div className="space-y-0.5 max-h-36 overflow-y-auto">
            {available.length === 0 ? (
              <p className="text-xs text-faint text-center py-2">No stocks available</p>
            ) : available.map((s) => (
              <button
                key={s.symbol}
                onClick={() => add(s.symbol)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{s.symbol}</span>
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {watched.map((stock) => (
            <div key={stock.symbol} className="relative group">
              <StockCard stock={stock} onClick={() => onSelect(stock.symbol)} />
              <button
                onClick={(e) => { e.stopPropagation(); remove(stock.symbol); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#fee2e2" }}
              >
                <X size={10} style={{ color: "var(--down)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
