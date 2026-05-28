"use client";
import { LayoutGrid, Briefcase } from "lucide-react";

type Tab = "summary" | "portfolio";

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  const tabs: { id: Tab; label: string; Icon: typeof LayoutGrid }[] = [
    { id: "summary", label: "Summary", Icon: LayoutGrid },
    { id: "portfolio", label: "Portfolio", Icon: Briefcase },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: "rgba(6,14,8,0.92)",
        borderTop: "1px solid rgba(110,231,183,0.14)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
          >
            <Icon
              size={20}
              style={{ color: isActive ? "#6ee7b7" : "rgba(167,243,208,0.4)" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? "#6ee7b7" : "rgba(167,243,208,0.4)" }}
            >
              {label}
            </span>
            {isActive && (
              <div
                className="absolute bottom-0 rounded-full"
                style={{
                  width: 32,
                  height: 2,
                  background: "#6ee7b7",
                  marginBottom: "env(safe-area-inset-bottom)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
