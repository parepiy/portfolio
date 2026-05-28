"use client";

import { useState } from "react";
import { mockStocks } from "@/data/mockStocks";
import { Stock } from "@/types/stock";
import StockCard from "@/components/StockCard";
import StockDetail from "@/components/StockDetail";
import { Plus, X, Search, TrendingUp, BarChart2, Newspaper } from "lucide-react";

export default function Home() {
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "NVDA", "TSLA"]);
  const [selected, setSelected] = useState<string>("AAPL");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const watchedStocks = watchlist
    .map((sym) => mockStocks.find((s) => s.symbol === sym))
    .filter(Boolean) as Stock[];

  const selectedStock = mockStocks.find((s) => s.symbol === selected) || watchedStocks[0];

  const addStock = (sym: string) => {
    if (!watchlist.includes(sym)) setWatchlist([...watchlist, sym]);
    setSearchOpen(false);
    setQuery("");
    setSelected(sym);
  };

  const removeStock = (sym: string) => {
    const next = watchlist.filter((s) => s !== sym);
    setWatchlist(next);
    if (selected === sym && next.length > 0) setSelected(next[0]);
  };

  const availableToAdd = mockStocks
    .filter((s) => !watchlist.includes(s.symbol))
    .filter(
      (s) =>
        s.symbol.includes(query.toUpperCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
    );

  const totalGain =
    watchedStocks.reduce((sum, s) => sum + s.changePercent, 0) / watchedStocks.length;
  const bullishCount = watchedStocks.filter((s) => s.overallSentiment === "bullish").length;

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart2 size={16} />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-none">StockWatch</h1>
            <p className="text-xs text-gray-400 mt-0.5">US Stock Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <TrendingUp
              size={13}
              className={totalGain >= 0 ? "text-green-400" : "text-red-400"}
            />
            <span>Portfolio avg: </span>
            <span
              className={
                totalGain >= 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"
              }
            >
              {totalGain >= 0 ? "+" : ""}
              {totalGain.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Newspaper size={13} className="text-blue-400" />
            <span>
              {bullishCount}/{watchedStocks.length} Bullish
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left sidebar — watchlist */}
        <aside className="w-72 border-r border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Watchlist ({watchlist.length})
            </span>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-7 h-7 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 flex items-center justify-center transition-colors"
            >
              <Plus size={14} className="text-blue-400" />
            </button>
          </div>

          {/* Search to add */}
          {searchOpen && (
            <div className="p-3 border-b border-white/10 bg-white/5">
              <div className="relative mb-2">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search symbol or name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {availableToAdd.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">No more stocks to add</p>
                )}
                {availableToAdd.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => addStock(s.symbol)}
                    className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white">{s.symbol}</span>
                      <span className="text-xs text-gray-400 ml-2">{s.name}</span>
                    </div>
                    <span
                      className={`text-xs ${s.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {s.changePercent >= 0 ? "+" : ""}
                      {s.changePercent.toFixed(2)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {watchedStocks.map((stock) => (
              <div key={stock.symbol} className="relative group">
                <StockCard
                  stock={stock}
                  isSelected={selected === stock.symbol}
                  onClick={() => setSelected(stock.symbol)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStock(stock.symbol);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/40 flex items-center justify-center"
                >
                  <X size={10} className="text-gray-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedStock ? (
            <StockDetail stock={selectedStock} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BarChart2 size={48} className="mb-4 opacity-30" />
              <p>Add stocks to your watchlist to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
