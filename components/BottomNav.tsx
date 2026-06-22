"use client";

import { Home, CalendarDays, MapPin, MessagesSquare, LifeBuoy, type LucideIcon } from "lucide-react";
import { C } from "@/lib/theme";
import { useT } from "@/lib/i18n";

export type TabId = "inicio" | "dias" | "mapa" | "frases" | "ayuda";

const TAB_ICONS: { id: TabId; Icon: LucideIcon }[] = [
  { id: "inicio", Icon: Home },
  { id: "dias", Icon: CalendarDays },
  { id: "mapa", Icon: MapPin },
  { id: "frases", Icon: MessagesSquare },
  { id: "ayuda", Icon: LifeBuoy },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  const { t } = useT();
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
      {TAB_ICONS.map(({ id, Icon }) => {
        const on = id === active;
        const label = t(`nav.${id}`);
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
