"use client";
import { useState } from "react";
import { mockStocks } from "@/data/mockStocks";
import SummaryView from "@/components/SummaryView";
import StockDetail from "@/components/StockDetail";
import PortfolioView from "@/components/PortfolioView";
import BottomNav from "@/components/BottomNav";
import { BarChart2 } from "lucide-react";

type Tab = "summary" | "portfolio";

export default function Home() {
  const [tab, setTab] = useState<Tab>("summary");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [prevTab, setPrevTab] = useState<Tab>("summary");

  const openStock = (symbol: string) => {
    setPrevTab(tab);
    setSelectedSymbol(symbol);
  };

  const closeStock = () => {
    setSelectedSymbol(null);
    setTab(prevTab);
  };

  const selectedStock = selectedSymbol ? mockStocks.find((s) => s.symbol === selectedSymbol) : null;

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#060e08" }}>
      {/* Top header */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(110,231,183,0.12)", background: "rgba(6,14,8,0.95)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #34d399, #6ee7b7)" }}
          >
            <BarChart2 size={15} style={{ color: "#060e08" }} />
          </div>
          <div>
            <div className="font-bold text-sm leading-none" style={{ color: "#ecfdf5" }}>StockWatch</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(167,243,208,0.5)" }}>US Market</div>
          </div>
        </div>

        {!selectedSymbol && (
          <div className="flex gap-2 text-xs" style={{ color: "rgba(167,243,208,0.5)" }}>
            <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: selectedSymbol ? 0 : 64 }}>
        {selectedSymbol && selectedStock ? (
          <div className="h-full overflow-hidden flex flex-col">
            <StockDetail stock={selectedStock} onBack={closeStock} />
          </div>
        ) : tab === "summary" ? (
          <SummaryView onSelect={openStock} />
        ) : (
          <PortfolioView onSelectStock={openStock} />
        )}
      </main>

      {/* Bottom nav — hidden when viewing stock detail */}
      {!selectedSymbol && <BottomNav active={tab} onChange={setTab} />}
    </div>
  );
}
