"use client";

import { NewsItem } from "@/types/stock";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

interface Props {
  news: NewsItem;
}

export default function NewsCard({ news }: Props) {
  const sentimentConfig = {
    bullish: {
      icon: TrendingUp,
      label: "Bullish",
      cls: "text-green-400 bg-green-400/10 border-green-400/20",
      barColor: "bg-green-400",
    },
    bearish: {
      icon: TrendingDown,
      label: "Bearish",
      cls: "text-red-400 bg-red-400/10 border-red-400/20",
      barColor: "bg-red-400",
    },
    neutral: {
      icon: Minus,
      label: "Neutral",
      cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      barColor: "bg-yellow-400",
    },
  }[news.sentiment];

  const Icon = sentimentConfig.icon;
  const absScore = Math.abs(news.sentimentScore) * 100;

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/8 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-medium text-white leading-snug flex-1">{news.title}</h4>
        <span className={`shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${sentimentConfig.cls}`}>
          <Icon size={11} />
          {sentimentConfig.label}
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-3">{news.summary}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-gray-400 font-medium">{news.source}</span>
          <span>·</span>
          <span>{news.publishedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Strength</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${sentimentConfig.barColor}`}
                style={{ width: `${absScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{absScore.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
