"use client";
import { useState, useEffect } from "react";
import { Position } from "@/types/stock";
import { mockStocks } from "@/data/mockStocks";
import { Plus, X, TrendingUp, TrendingDown, ChevronRight, Wallet } from "lucide-react";

interface Props {
  onSelectStock: (symbol: string) => void;
}

function AddForm({ onAdd, onClose }: { onAdd: (p: Omit<Position, "id" | "addedAt">) => void; onClose: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");

  const symbolsAvailable = mockStocks.map((s) => s.symbol);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares || !avgPrice) return;
    onAdd({ symbol, shares: parseFloat(shares), avgBuyPrice: parseFloat(avgPrice) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{ background: "rgba(6,14,8,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm mx-4 mb-8 md:mb-0 card p-5" style={{ borderRadius: 20 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base text-mint">Add Position</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ background: "rgba(251,113,133,0.1)", color: "#fb7185" }}>
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
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none appearance-none"
              style={{ background: "rgba(167,243,208,0.07)", border: "1px solid rgba(110,231,183,0.2)", color: "#ecfdf5" }}
            >
              <option value="" style={{ background: "#0d1f10" }}>Select stock...</option>
              {symbolsAvailable.map((s) => (
                <option key={s} value={s} style={{ background: "#0d1f10" }}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-dim mb-1.5 block">Number of Shares</label>
            <input
              type="number"
              min="0.0001"
              step="any"
              placeholder="e.g. 10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background: "rgba(167,243,208,0.07)", border: "1px solid rgba(110,231,183,0.2)", color: "#ecfdf5" }}
            />
          </div>
          <div>
            <label className="text-xs text-dim mb-1.5 block">Average Buy Price (USD)</label>
            <input
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g. 195.00"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              required
              className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background: "rgba(167,243,208,0.07)", border: "1px solid rgba(110,231,183,0.2)", color: "#ecfdf5" }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #34d399, #6ee7b7)", color: "#060e08" }}
          >
            Add Position
          </button>
        </form>
      </div>
    </div>
  );
}

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

  const addPosition = (p: Omit<Position, "id" | "addedAt">) => {
    setPositions((prev) => [...prev, { ...p, id: crypto.randomUUID(), addedAt: new Date().toISOString() }]);
  };

  const removePosition = (id: string) => setPositions((prev) => prev.filter((p) => p.id !== id));

  // Aggregate by symbol for summary
  const aggregated = positions.reduce<Record<string, { shares: number; totalCost: number }>>((acc, pos) => {
    if (!acc[pos.symbol]) acc[pos.symbol] = { shares: 0, totalCost: 0 };
    acc[pos.symbol].shares += pos.shares;
    acc[pos.symbol].totalCost += pos.shares * pos.avgBuyPrice;
    return acc;
  }, {});

  type Holding = { symbol: string; stock: ReturnType<typeof mockStocks.find> & object; shares: number; avgBuy: number; currentValue: number; costBasis: number; pnl: number; pnlPct: number };

  const holdingsRaw = Object.entries(aggregated).map(([symbol, data]) => {
    const stock = mockStocks.find((s) => s.symbol === symbol);
    if (!stock) return null;
    const avgBuy = data.totalCost / data.shares;
    const currentValue = data.shares * stock.currentPrice;
    const costBasis = data.totalCost;
    const pnl = currentValue - costBasis;
    const pnlPct = (pnl / costBasis) * 100;
    return { symbol, stock, shares: data.shares, avgBuy, currentValue, costBasis, pnl, pnlPct };
  });
  const holdings = holdingsRaw.filter((h): h is NonNullable<typeof h> => h !== null);

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const fmt = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!loaded) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Portfolio summary */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        {holdings.length > 0 ? (
          <div className="card p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-dim mb-1">Total Portfolio Value</div>
                <div className="text-2xl font-bold" style={{ color: "#ecfdf5" }}>{fmt(totalValue)}</div>
                <div className={`flex items-center gap-1 text-sm font-semibold mt-1 ${totalPnl >= 0 ? "text-up" : "text-down"}`}>
                  {totalPnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)} ({totalPnlPct >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-dim mb-1">Cost Basis</div>
                <div className="font-semibold text-sm" style={{ color: "#ecfdf5" }}>{fmt(totalCost)}</div>
                <div className="text-xs text-dim mt-1">{holdings.length} positions</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 mb-4 flex flex-col items-center text-center">
            <Wallet size={36} style={{ color: "rgba(167,243,208,0.25)" }} className="mb-3" />
            <p className="text-sm font-medium text-dim mb-1">No positions yet</p>
            <p className="text-xs" style={{ color: "rgba(167,243,208,0.35)" }}>Add your first position to track P&L</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-dim uppercase tracking-wider">Positions ({holdings.length})</span>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(110,231,183,0.12)", color: "#6ee7b7", border: "1px solid rgba(110,231,183,0.25)" }}
          >
            <Plus size={13} /> Add Position
          </button>
        </div>
      </div>

      {/* Holdings list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
        {holdings.map((h) => (
          <div key={h.symbol} className="card card-hover p-4 cursor-pointer" onClick={() => onSelectStock(h.symbol)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base" style={{ color: "#ecfdf5" }}>{h.symbol}</span>
                  <span className="text-xs text-dim">{h.stock.name}</span>
                </div>
                <div className="text-xs text-dim mt-0.5">
                  {h.shares} shares · avg ${h.avgBuy.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-semibold text-sm" style={{ color: "#ecfdf5" }}>{fmt(h.currentValue)}</div>
                  <div className={`text-xs font-semibold ${h.pnl >= 0 ? "text-up" : "text-down"}`}>
                    {h.pnl >= 0 ? "+" : ""}{fmt(h.pnl)} ({h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(2)}%)
                  </div>
                </div>
                <ChevronRight size={14} className="text-dim" />
              </div>
            </div>

            {/* Progress bar: current vs buy price */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-dim mb-1">
                <span>Buy ${h.avgBuy.toFixed(2)}</span>
                <span>Now ${h.stock.currentPrice.toFixed(2)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(167,243,208,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(5, (h.stock.currentPrice / (h.avgBuy * 1.5)) * 100))}%`,
                    background: h.pnl >= 0 ? "linear-gradient(90deg, #34d399, #4ade80)" : "linear-gradient(90deg, #fb7185, #f43f5e)",
                  }}
                />
              </div>
            </div>

            {/* Remove button row */}
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  positions.filter((p) => p.symbol === h.symbol).forEach((p) => removePosition(p.id));
                }}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ color: "#fb7185", background: "rgba(251,113,133,0.08)" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddForm onAdd={addPosition} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
