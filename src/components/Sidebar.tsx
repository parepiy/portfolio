"use client";
import { LayoutGrid, Briefcase, X, BarChart2 } from "lucide-react";

type Tab = "summary" | "portfolio";

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

const tabs: { id: Tab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "summary",   label: "Summary",   Icon: LayoutGrid },
  { id: "portfolio", label: "Portfolio", Icon: Briefcase  },
];

function NavItems({ active, onChange, onClose }: { active: Tab; onChange: (t: Tab) => void; onClose: () => void }) {
  return (
    <nav className="p-3 space-y-1">
      {tabs.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => { onChange(id); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm"
            style={{
              background: on ? "#d1fae5" : "transparent",
              color:      on ? "#047857" : "#6b7280",
              fontWeight: on ? 600 : 400,
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ active, onChange, drawerOpen, onDrawerClose }: Props) {
  return (
    <>
      {/* Desktop sidebar — always visible ≥ md */}
      <aside
        className="hidden md:flex flex-col w-48 shrink-0"
        style={{ background: "#ecfdf5", borderRight: "1px solid #d1fae5" }}
      >
        <NavItems active={active} onChange={onChange} onClose={() => {}} />
      </aside>

      {/* Mobile drawer — slides in from left */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.3)", backdropFilter: "blur(2px)" }}
            onClick={onDrawerClose}
          />
          {/* drawer panel */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{
              background: "#f5fef7",
              borderRight: "1px solid #d1fae5",
              boxShadow: "6px 0 24px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: "1px solid #d1fae5" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#10b981" }}>
                  <BarChart2 size={14} style={{ color: "#fff" }} />
                </div>
                <span className="font-bold text-sm" style={{ color: "#0f172a" }}>StockWatch</span>
              </div>
              <button
                onClick={onDrawerClose}
                className="p-1.5 rounded-lg"
                style={{ color: "#6b7280", background: "#f3f4f6" }}
              >
                <X size={15} />
              </button>
            </div>
            <NavItems active={active} onChange={onChange} onClose={onDrawerClose} />
          </aside>
        </div>
      )}
    </>
  );
}
