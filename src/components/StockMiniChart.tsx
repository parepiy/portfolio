"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";

export default function StockMiniChart({ stock, height = 52 }: { stock: Stock; height?: number }) {
  const data = stock.priceHistory.slice(-30);
  const isUp = stock.change >= 0;
  const color = isUp ? "#4ade80" : "#fb7185";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ background: "#0d1f10", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 8, fontSize: 11 }}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
          labelFormatter={(l) => l}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
