"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";

interface Props {
  stock: Stock;
}

export default function StockMiniChart({ stock }: Props) {
  const last30 = stock.priceHistory.slice(-30);
  const isUp = stock.change >= 0;

  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={last30}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={isUp ? "#22c55e" : "#ef4444"}
          strokeWidth={1.5}
          dot={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, padding: "2px 8px", borderRadius: 6 }}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
          labelFormatter={(label) => label}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
