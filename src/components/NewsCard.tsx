"use client";
import { NewsItem } from "@/types/stock";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function NewsCard({ news }: { news: NewsItem }) {
  const cfg = {
    bullish: { Icon: TrendingUp,  cls: "badge-bullish", bar: "#059669" },
    bearish: { Icon: TrendingDown, cls: "badge-bearish", bar: "#dc2626" },
    neutral: { Icon: Minus,       cls: "badge-neutral", bar: "#d97706" },
  }[news.sentiment];
  const score = Math.abs(news.sentimentScore) * 100;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-medium leading-snug flex-1" style={{ color: "var(--text)" }}>{news.title}</h4>
        <span className={`badge ${cfg.cls} shrink-0`}>
          <cfg.Icon size={10} />
          {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
        </span>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-2)" }}>{news.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-dim">
          <span className="font-medium" style={{ color: "var(--text)" }}>{news.source}</span>
          <span>·</span>
          <span>{news.publishedAt}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full" style={{ width: `${score}%`, background: cfg.bar }} />
          </div>
          <span className="text-xs text-faint">{score.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
