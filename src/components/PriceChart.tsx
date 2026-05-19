"use client";

import { useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Stock } from "@/types/stock";

interface Props {
  stock: Stock;
}

const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];

export default function PriceChart({ stock }: Props) {
  const [period, setPeriod] = useState(30);

  const data = stock.priceHistory.slice(-period).map((p) => ({
    ...p,
    buyLow: stock.buyZone.low,
    buyHigh: stock.buyZone.high,
    sellLow: stock.sellZone.low,
    sellHigh: stock.sellZone.high,
  }));

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices, stock.buyZone.low) * 0.98;
  const maxPrice = Math.max(...prices, stock.sellZone.high) * 1.02;

  const isUp = stock.change >= 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Price Chart</h3>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                period === p.days
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.2} />
              <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={55}
          />
          <Tooltip
            contentStyle={{ background: "#1e2030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => {
              const labels: Record<string, string> = { price: "Price", buyHigh: "Buy Zone High", buyLow: "Buy Zone Low", sellHigh: "Sell Zone High", sellLow: "Sell Zone Low" };
              return [`$${Number(v).toFixed(2)}`, labels[String(name)] || String(name)];
            }}
          />

          {/* Buy zone band */}
          <Area type="monotone" dataKey="buyHigh" stroke="none" fill="url(#buyGrad)" legendType="none" />
          <Area type="monotone" dataKey="buyLow" stroke="none" fill="transparent" legendType="none" />

          {/* Sell zone band */}
          <Area type="monotone" dataKey="sellHigh" stroke="none" fill="url(#sellGrad)" legendType="none" />
          <Area type="monotone" dataKey="sellLow" stroke="none" fill="transparent" legendType="none" />

          {/* Price line */}
          <Area
            type="monotone"
            dataKey="price"
            stroke={isUp ? "#22c55e" : "#ef4444"}
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
          />

          {/* Support lines */}
          {stock.supportLevels.map((s) => (
            <ReferenceLine
              key={`sup-${s.level}`}
              y={s.level}
              stroke="#22c55e"
              strokeDasharray={s.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={s.strength === "strong" ? 0.8 : 0.45}
              label={{ value: `S ${s.level}`, position: "right", fontSize: 9, fill: "#22c55e" }}
            />
          ))}

          {/* Resistance lines */}
          {stock.resistanceLevels.map((r) => (
            <ReferenceLine
              key={`res-${r.level}`}
              y={r.level}
              stroke="#ef4444"
              strokeDasharray={r.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={r.strength === "strong" ? 0.8 : 0.45}
              label={{ value: `R ${r.level}`, position: "right", fontSize: 9, fill: "#ef4444" }}
            />
          ))}

          {/* Current price */}
          <ReferenceLine
            y={stock.currentPrice}
            stroke="#60a5fa"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: `$${stock.currentPrice}`, position: "right", fontSize: 9, fill: "#60a5fa" }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-500 opacity-60" />
          <span>Support</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500 opacity-60" />
          <span>Resistance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-green-500 opacity-20 rounded" />
          <span>Buy Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-red-500 opacity-20 rounded" />
          <span>Sell Zone</span>
        </div>
      </div>
    </div>
  );
}
