"use client";
import { useState, useEffect } from "react";
import { Position } from "@/types/stock";
import { mockStocks } from "@/data/mockStocks";
import { Plus, X, TrendingUp, TrendingDown, ChevronRight, Wallet } from "lucide-react";

interface Props { onSelectStock: (symbol: string) => void; }

function AddForm({ onAdd, onClose }: { onAdd: (p: Omit<Position, "id" | "addedAt">) => void; onClose: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares || !avgPrice) return;
    onAdd({ symbol, shares: parseFloat(shares), avgBuyPrice: parseFloat(avgPrice) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm mx-4 mb-8 md:mb-0 card p-5" style={{ borderRadius: 20 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base text-mint">Add Position</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ background: "var(--down-bg)", color: "var(--down)" }}>
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-dim mb-1.5 block">Stock Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              className="input-mint w-full text-sm px-3 py-2.5"
            >
              <option value="">Select stock...</option>
              {mockStocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-dim mb-1.5 block">Number of Shares</label>
            <input type="number" min="0.0001" step="any" placeholder="e.g. 10"
              value={shares} onChange={(e) => setShares(e.target.value)} required
              className="input-mint w-full text-sm px-3 py-2.5"
            />
          </div>
          <div>
            <label className="text-xs text-dim mb-1.5 block">Average Buy Price (USD)</label>
            <input type="number" min="0.01" step="any" placeholder="e.g. 195.00"
              value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} required
              className="input-mint w-full text-sm px-3 py-2.5"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--mint)", color: "#fff" }}>
            Add Position
          </button>
        </form>
      </div>
    </div>
  );
}

type Holding = {
  symbol: string;
  stock: (typeof mockStocks)[number];
  shares: number;
  avgBuy: number;
  currentValue: number;
  costBasis: number;
  pnl: number;
  pnlPct: number;
};

export default function PortfolioView({ onSelectStock }: Props) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("stockwatch_portfolio");
      if (saved) setPositions(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("stockwatch_portfolio", JSON.stringify(positions));
  }, [positions, loaded]);

  const add = (p: Omit<Position, "id" | "addedAt">) =>
    setPositions((prev) => [...prev, { ...p, id: crypto.randomUUID(), addedAt: new Date().toISOString() }]);

  const removeBySymbol = (sym: string) =>
    setPositions((prev) => prev.filter((p) => p.symbol !== sym));

  // Aggregate positions by symbol
  const agg = positions.reduce<Record<string, { shares: number; totalCost: number }>>((acc, pos) => {
    if (!acc[pos.symbol]) acc[pos.symbol] = { shares: 0, totalCost: 0 };
    acc[pos.symbol].shares    += pos.shares;
    acc[pos.symbol].totalCost += pos.shares * pos.avgBuyPrice;
    return acc;
  }, {});

  const holdings: Holding[] = Object.entries(agg).flatMap(([symbol, data]) => {
    const stock = mockStocks.find((s) => s.symbol === symbol);
    if (!stock) return [];
    const avgBuy       = data.totalCost / data.shares;
    const currentValue = data.shares * stock.currentPrice;
    const costBasis    = data.totalCost;
    const pnl          = currentValue - costBasis;
    const pnlPct       = (pnl / costBasis) * 100;
    return [{ symbol, stock, shares: data.shares, avgBuy, currentValue, costBasis, pnl, pnlPct }];
  });

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalCost  = holdings.reduce((s, h) => s + h.costBasis, 0);
  const totalPnl   = totalValue - totalCost;
  const totalPct   = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const fmt = (n: number) =>
    n >= 1e6
      ? `$${(n / 1e6).toFixed(2)}M`
      : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!loaded) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Summary card */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        {holdings.length > 0 ? (
          <div className="card p-4 mb-3" style={{ background: "var(--surface-2)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-faint mb-1">Total Portfolio Value</div>
                <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>{fmt(totalValue)}</div>
                <div className={`flex items-center gap-1 text-sm font-semibold mt-1 ${totalPnl >= 0 ? "text-up" : "text-down"}`}>
                  {totalPnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)} ({totalPct >= 0 ? "+" : ""}{totalPct.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-faint mb-1">Cost Basis</div>
                <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{fmt(totalCost)}</div>
                <div className="text-xs text-faint mt-1">{holdings.length} positions</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 mb-3 flex flex-col items-center text-center" style={{ background: "var(--surface-2)" }}>
            <Wallet size={40} style={{ color: "var(--border-2)" }} className="mb-3" />
            <p className="text-sm font-medium text-dim mb-1">No positions yet</p>
            <p className="text-xs text-faint">Add your first position to track P&amp;L</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-faint uppercase tracking-wider">
            Positions ({holdings.length})
          </span>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "var(--mint-bg)", color: "var(--mint)" }}
          >
            <Plus size={13} /> Add Position
          </button>
        </div>
      </div>

      {/* Holdings list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
        {holdings.map((h) => (
          <div key={h.symbol} className="card card-hover p-4" onClick={() => onSelectStock(h.symbol)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base" style={{ color: "var(--text)" }}>{h.symbol}</span>
                  <span className="text-xs text-faint">{h.stock.name}</span>
                </div>
                <div className="text-xs text-dim mt-0.5">
                  {h.shares} shares · avg ${h.avgBuy.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{fmt(h.currentValue)}</div>
                  <div className={`text-xs font-semibold ${h.pnl >= 0 ? "text-up" : "text-down"}`}>
                    {h.pnl >= 0 ? "+" : ""}{fmt(h.pnl)} ({h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(2)}%)
                  </div>
                </div>
                <ChevronRight size={14} className="text-faint" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-faint mb-1">
                <span>Avg Buy ${h.avgBuy.toFixed(2)}</span>
                <span>Now ${h.stock.currentPrice.toFixed(2)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(5, (h.stock.currentPrice / (h.avgBuy * 1.5)) * 100))}%`,
                    background: h.pnl >= 0 ? "var(--up)" : "var(--down)",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); removeBySymbol(h.symbol); }}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ color: "var(--down)", background: "var(--down-bg)" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddForm onAdd={add} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
