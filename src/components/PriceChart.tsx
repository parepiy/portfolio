"use client";
import { useState } from "react";
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Stock } from "@/types/stock";

const PERIODS = [{ label: "1M", days: 30 }, { label: "3M", days: 90 }];

export default function PriceChart({ stock }: { stock: Stock }) {
  const [period, setPeriod] = useState(30);
  const isUp = stock.change >= 0;
  const lineColor = isUp ? "#4ade80" : "#fb7185";

  const data = stock.priceHistory.slice(-period).map((p) => ({
    ...p,
    buyLow: stock.buyZone.low,
    buyHigh: stock.buyZone.high,
    sellLow: stock.sellZone.low,
    sellHigh: stock.sellZone.high,
  }));

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices, stock.buyZone.low) * 0.975;
  const maxPrice = Math.max(...prices, stock.sellZone.high) * 1.025;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-mint">Price Chart</h3>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className="text-xs px-3 py-1 rounded-lg transition-colors"
              style={period === p.days
                ? { background: "rgba(110,231,183,0.2)", color: "#6ee7b7", border: "1px solid rgba(110,231,183,0.4)" }
                : { color: "rgba(167,243,208,0.45)", border: "1px solid transparent" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ left: 0, right: 40, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(110,231,183,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "rgba(167,243,208,0.4)" }}
            tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth()+1}/${d.getDate()}`; }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 10, fill: "rgba(167,243,208,0.4)" }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={52}
          />
          <Tooltip
            contentStyle={{ background: "#0d1f10", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 8, fontSize: 11 }}
            formatter={(v, name) => {
              const labels: Record<string, string> = { price: "Price", buyHigh: "Buy High", buyLow: "Buy Low", sellHigh: "Sell High", sellLow: "Sell Low" };
              return [`$${Number(v).toFixed(2)}`, labels[String(name)] || String(name)];
            }}
          />

          <Area type="monotone" dataKey="buyHigh" stroke="none" fill="url(#bg)" legendType="none" />
          <Area type="monotone" dataKey="buyLow" stroke="none" fill="transparent" legendType="none" />
          <Area type="monotone" dataKey="sellHigh" stroke="none" fill="url(#sg)" legendType="none" />
          <Area type="monotone" dataKey="sellLow" stroke="none" fill="transparent" legendType="none" />

          <Area type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} fill="url(#pg)" dot={false} />

          {stock.supportLevels.map((s) => (
            <ReferenceLine key={`s-${s.level}`} y={s.level}
              stroke="#4ade80"
              strokeDasharray={s.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={s.strength === "strong" ? 0.7 : 0.4}
              label={{ value: `S ${s.level}`, position: "right", fontSize: 9, fill: "#4ade80" }}
            />
          ))}
          {stock.resistanceLevels.map((r) => (
            <ReferenceLine key={`r-${r.level}`} y={r.level}
              stroke="#fb7185"
              strokeDasharray={r.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={r.strength === "strong" ? 0.7 : 0.4}
              label={{ value: `R ${r.level}`, position: "right", fontSize: 9, fill: "#fb7185" }}
            />
          ))}
          <ReferenceLine y={stock.currentPrice} stroke="#a7f3d0" strokeDasharray="6 3" strokeWidth={1.5}
            label={{ value: `$${stock.currentPrice}`, position: "right", fontSize: 9, fill: "#a7f3d0" }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-3 text-xs" style={{ color: "rgba(167,243,208,0.45)" }}>
        {[["#4ade80", "Support"], ["#fb7185", "Resistance"], ["#4ade80", "Buy Zone", true], ["#fb7185", "Sell Zone", true]].map(([c, l, isBox]) => (
          <div key={String(l)} className="flex items-center gap-1.5">
            {isBox
              ? <div className="w-3 h-2 rounded" style={{ background: String(c), opacity: 0.25 }} />
              : <div className="w-3 rounded" style={{ height: 2, background: String(c), opacity: 0.7 }} />
            }
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
