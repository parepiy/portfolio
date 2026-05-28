"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";

export default function StockMiniChart({ stock, height = 52 }: { stock: Stock; height?: number }) {
  const data = stock.priceHistory.slice(-30);
  const color = stock.change >= 0 ? "#059669" : "#dc2626";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.8} dot={false} />
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #d1fae5", borderRadius: 8, fontSize: 11 }}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
          labelFormatter={(l) => l}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
