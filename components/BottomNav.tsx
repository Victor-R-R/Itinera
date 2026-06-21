"use client";

import { Home, CalendarDays, MapPin, MessagesSquare, LifeBuoy, type LucideIcon } from "lucide-react";
import { C } from "@/lib/theme";

export type TabId = "inicio" | "dias" | "mapa" | "frases" | "ayuda";

const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: "inicio", label: "Inicio", Icon: Home },
  { id: "dias", label: "Días", Icon: CalendarDays },
  { id: "mapa", label: "Mapa", Icon: MapPin },
  { id: "frases", label: "Frases", Icon: MessagesSquare },
  { id: "ayuda", label: "Ayuda", Icon: LifeBuoy },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <nav
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 14,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: 26,
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 14px 34px -12px rgba(44,26,46,.40)",
        padding: "8px 6px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const on = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={on ? "page" : undefined}
            style={{
              flex: 1,
              border: "none",
              background: on ? "rgba(224,101,79,0.12)" : "transparent",
              borderRadius: 18,
              padding: "7px 2px 5px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              transition: "background .2s",
            }}
          >
            <Icon size={21} strokeWidth={on ? 2.4 : 1.9} color={on ? C.rose : C.inkSoft} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, color: on ? C.rose : C.inkSoft }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
