"use client";
import { useState } from "react";
import { mockStocks } from "@/data/mockStocks";
import SummaryView from "@/components/SummaryView";
import StockDetail from "@/components/StockDetail";
import PortfolioView from "@/components/PortfolioView";
import Sidebar from "@/components/Sidebar";
import { BarChart2, Menu } from "lucide-react";

type Tab = "summary" | "portfolio";

export default function Home() {
  const [tab, setTab]                 = useState<Tab>("summary");
  const [selectedSymbol, setSelected] = useState<string | null>(null);
  const [prevTab, setPrevTab]         = useState<Tab>("summary");
  const [drawerOpen, setDrawerOpen]   = useState(false);

  const openStock = (symbol: string) => { setPrevTab(tab); setSelected(symbol); };
  const closeStock = () => { setSelected(null); setTab(prevTab); };

  const selectedStock = selectedSymbol ? mockStocks.find((s) => s.symbol === selectedSymbol) : null;

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
      >
        {/* Hamburger — mobile only */}
        {!selectedSymbol && (
          <button
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: "var(--mint)", background: "var(--mint-bg)" }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#10b981" }}>
            <BarChart2 size={15} style={{ color: "#fff" }} />
          </div>
          <div>
            <div className="font-bold text-sm leading-none" style={{ color: "var(--text)" }}>StockWatch</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>US Market · Demo Data</div>
          </div>
        </div>

        <div className="ml-auto text-xs" style={{ color: "var(--text-3)" }}>
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={selectedSymbol ? prevTab : tab}
          onChange={(t) => { setTab(t); setSelected(null); }}
          drawerOpen={drawerOpen}
          onDrawerClose={() => setDrawerOpen(false)}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {selectedSymbol && selectedStock ? (
            <StockDetail stock={selectedStock} onBack={closeStock} />
          ) : tab === "summary" ? (
            <SummaryView onSelect={openStock} />
          ) : (
            <PortfolioView onSelectStock={openStock} />
          )}
        </main>
      </div>
    </div>
  );
}
