"use client";
import { useState } from "react";
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Stock } from "@/types/stock";

const PERIODS = [{ label: "1M", days: 30 }, { label: "3M", days: 90 }];

export default function PriceChart({ stock }: { stock: Stock }) {
  const [period, setPeriod] = useState(30);
  const upColor   = "#059669";
  const downColor = "#dc2626";
  const lineColor = stock.change >= 0 ? upColor : downColor;

  const data = stock.priceHistory.slice(-period).map((p) => ({
    ...p,
    buyLow:   stock.buyZone.low,
    buyHigh:  stock.buyZone.high,
    sellLow:  stock.sellZone.low,
    sellHigh: stock.sellZone.high,
  }));

  const prices   = data.map((d) => d.price);
  const minPrice = Math.min(...prices, stock.buyZone.low)  * 0.975;
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
                ? { background: "var(--mint-bg)", color: "var(--mint)", fontWeight: 600 }
                : { color: "var(--text-3)" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ left: 0, right: 44, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={lineColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={upColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={upColor} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={downColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={downColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth()+1}/${d.getDate()}`; }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={52}
          />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #d1fae5", borderRadius: 8, fontSize: 11 }}
            formatter={(v, name) => {
              const lbl: Record<string, string> = { price: "Price", buyHigh: "Buy High", buyLow: "Buy Low", sellHigh: "Sell High", sellLow: "Sell Low" };
              return [`$${Number(v).toFixed(2)}`, lbl[String(name)] || String(name)];
            }}
          />

          <Area type="monotone" dataKey="buyHigh"  stroke="none" fill="url(#bg)" legendType="none" />
          <Area type="monotone" dataKey="buyLow"   stroke="none" fill="transparent" legendType="none" />
          <Area type="monotone" dataKey="sellHigh" stroke="none" fill="url(#sg)" legendType="none" />
          <Area type="monotone" dataKey="sellLow"  stroke="none" fill="transparent" legendType="none" />
          <Area type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} fill="url(#pg)" dot={false} />

          {stock.supportLevels.map((s) => (
            <ReferenceLine key={`s${s.level}`} y={s.level}
              stroke={upColor}
              strokeDasharray={s.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={s.strength === "strong" ? 0.7 : 0.4}
              label={{ value: `S ${s.level}`, position: "right", fontSize: 9, fill: upColor }}
            />
          ))}
          {stock.resistanceLevels.map((r) => (
            <ReferenceLine key={`r${r.level}`} y={r.level}
              stroke={downColor}
              strokeDasharray={r.strength === "strong" ? "none" : "4 4"}
              strokeOpacity={r.strength === "strong" ? 0.7 : 0.4}
              label={{ value: `R ${r.level}`, position: "right", fontSize: 9, fill: downColor }}
            />
          ))}
          <ReferenceLine y={stock.currentPrice}
            stroke="#10b981" strokeDasharray="6 3" strokeWidth={1.5}
            label={{ value: `$${stock.currentPrice}`, position: "right", fontSize: 9, fill: "#10b981" }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-3 text-xs text-faint">
        {[["#059669","Support",false],["#dc2626","Resistance",false],["#059669","Buy Zone",true],["#dc2626","Sell Zone",true]].map(([c,l,box]) => (
          <div key={String(l)} className="flex items-center gap-1.5">
            {box
              ? <div className="w-3 h-2 rounded" style={{ background: String(c), opacity: 0.2 }} />
              : <div className="w-3 rounded" style={{ height: 2, background: String(c), opacity: 0.6 }} />
            }
            <span>{String(l)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
