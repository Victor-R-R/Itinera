"use client";

import { Heart, Sun, ChevronRight, LifeBuoy, MessagesSquare, MapPin, type LucideIcon } from "lucide-react";
import { C, FONT_DISPLAY } from "@/lib/theme";
import { fmt, cap, tripStatus, todayIndex } from "@/lib/format";
import { metaFor } from "@/lib/itinerary";
import { Header, SectionTitle } from "@/components/ui/Sections";
import type { TabId } from "@/components/BottomNav";
import type { Trip, ItineraryItem } from "@/lib/types";
import { useT } from "@/lib/i18n";

export default function InicioTab({
  trip,
  onTab,
  onOpenDay,
}: {
  trip: Trip;
  onTab: (id: TabId) => void;
  onOpenDay: (index: number) => void;
}) {
  const { t } = useT();
  const status = tripStatus(trip, t);
  const idx = todayIndex(trip);
  const featured = idx >= 0 ? idx : 0;
  const day = trip.days[featured];

  const summary = [
    { n: trip.days.length, l: t("inicio.stat_days") },
    { n: trip.cities.length, l: t("inicio.stat_cities") },
    { n: trip.days.flatMap((d) => d.items).filter((i) => i.type === "flight").length, l: t("inicio.stat_flights") },
    { n: trip.days.flatMap((d) => d.items).filter((i) => i.type === "activity").length, l: t("inicio.stat_activities") },
  ];

  return (
    <div>
      <div
        style={{
          background: trip.coverImage
            ? `linear-gradient(160deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.52) 100%), url(${trip.coverImage})`
            : `linear-gradient(160deg, ${trip.theme.from} 0%, ${trip.theme.mid} 52%, ${trip.theme.to} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "54px 22px 26px",
          color: "#fff",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        {trip.tagline && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, opacity: 0.92, fontSize: 12.5, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
            <Heart size={14} fill="#fff" color="#fff" /> {trip.tagline}
          </div>
        )}
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 32, lineHeight: 1.05, margin: "10px 0 4px" }}>
          {trip.travelers ?? trip.title}
        </h1>
        <div style={{ opacity: 0.92, fontSize: 14.5, display: "flex", alignItems: "center", gap: 6 }}>
          <Sun size={15} /> {trip.country} · {fmt(trip.startDate, { day: "numeric", month: "short" })} – {fmt(trip.endDate, { day: "numeric", month: "short" })}
        </div>

        <div
          style={{
            marginTop: 18,
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 18,
            padding: "14px 16px",
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600 }}>{status.big}</span>
          <span style={{ fontSize: 13.5, opacity: 0.95 }}>{status.small}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "16px 16px 4px" }}>
        {summary.map((s) => (
          <div key={s.l} style={{ flex: 1, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, padding: "12px 6px", textAlign: "center" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.rose }}>{s.n}</div>
            <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <SectionTitle>{idx >= 0 ? t("inicio.today") : t("inicio.firstDay")}</SectionTitle>
      {day ? (
        <div style={{ padding: "0 16px" }}>
          <button
            onClick={() => onOpenDay(featured)}
            style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.card, borderRadius: 18, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{day.city}</span>
              <span style={{ fontSize: 12.5, color: C.inkSoft }}>{cap(fmt(day.date, { weekday: "long", day: "numeric", month: "long" }))}</span>
            </div>
            {day.items.map((it) => (
              <MiniItem key={it.id} it={it} />
            ))}
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.rose, fontWeight: 700, fontSize: 13 }}>
              {t("inicio.viewFullDay")} <ChevronRight size={15} />
            </span>
          </button>
        </div>
      ) : (
        <Empty>{t("inicio.noDays")}</Empty>
      )}

      <SectionTitle>{t("inicio.quickAccess")}</SectionTitle>
      <div style={{ display: "flex", gap: 10, padding: "0 16px" }}>
        <Quick Icon={LifeBuoy} color={C.danger} label={t("inicio.quickHelp")} onClick={() => onTab("ayuda")} />
        <Quick Icon={MessagesSquare} color={C.dusk} label={t("inicio.quickPhrases")} onClick={() => onTab("frases")} />
        <Quick Icon={MapPin} color={C.amber} label={t("inicio.quickMap")} onClick={() => onTab("mapa")} />
      </div>
    </div>
  );
}

function MiniItem({ it }: { it: ItineraryItem }) {
  const m = metaFor(it.type);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <m.Icon size={16} color={m.color} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
      <span style={{ marginLeft: "auto", fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>{it.time}</span>
    </div>
  );
}

function Quick({ Icon, color, label, onClick }: { Icon: LucideIcon; color: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ flex: 1, border: `1px solid ${C.line}`, background: C.card, borderRadius: 16, padding: "14px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      <Icon size={22} color={color} />
      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink }}>{label}</span>
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0 16px", color: C.inkSoft, fontSize: 13.5, lineHeight: 1.5 }}>{children}</div>;
}
