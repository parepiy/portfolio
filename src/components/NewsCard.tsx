"use client";
import { NewsItem } from "@/types/stock";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function NewsCard({ news }: { news: NewsItem }) {
  const cfg = {
    bullish: { Icon: TrendingUp, cls: "badge-bullish", bar: "#4ade80" },
    bearish: { Icon: TrendingDown, cls: "badge-bearish", bar: "#fb7185" },
    neutral: { Icon: Minus, cls: "badge-neutral", bar: "#fcd34d" },
  }[news.sentiment];

  const score = Math.abs(news.sentimentScore) * 100;

  return (
    <div className="card p-4" style={{ borderRadius: 12 }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-medium leading-snug flex-1" style={{ color: "#ecfdf5" }}>{news.title}</h4>
        <span className={`badge ${cfg.cls} shrink-0`}>
          <cfg.Icon size={10} />
          {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
        </span>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(167,243,208,0.55)" }}>{news.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(167,243,208,0.45)" }}>
          <span style={{ color: "rgba(167,243,208,0.7)" }}>{news.source}</span>
          <span>·</span>
          <span>{news.publishedAt}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(167,243,208,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: `${score}%`, background: cfg.bar }} />
          </div>
          <span className="text-xs" style={{ color: "rgba(167,243,208,0.5)" }}>{score.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
