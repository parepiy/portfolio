export interface PricePoint {
  date: string;
  price: number;
  volume: number;
}

export interface SupportResistance {
  level: number;
  type: "support" | "resistance";
  strength: "weak" | "moderate" | "strong";
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  url: string;
}

export type Market   = "US" | "SET";
export type Currency = "USD" | "THB";

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  market: Market;
  currency: Currency;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
  week52High: number;
  week52Low: number;
  supportLevels: SupportResistance[];
  resistanceLevels: SupportResistance[];
  buyZone: { low: number; high: number };
  sellZone: { low: number; high: number };
  priceHistory: PricePoint[];
  news: NewsItem[];
  overallSentiment: "bullish" | "bearish" | "neutral";
  analystTarget: number;
  pe: number;
  eps: number;
}

export interface Position {
  id: string;
  symbol: string;
  shares: number;
  avgBuyPrice: number;
  addedAt: string;
}
