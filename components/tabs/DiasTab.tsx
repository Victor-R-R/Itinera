"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { fmt, cap, todayIndex } from "@/lib/format";
import { metaFor } from "@/lib/itinerary";
import { deleteItemFromDay, updateDayCity } from "@/lib/store";
import { Header } from "@/components/ui/Sections";
import AddDayDialog from "@/components/trips/AddDayDialog";
import AddItemDialog from "@/components/trips/AddItemDialog";
import type { Trip, ItineraryItem } from "@/lib/types";
import { useT } from "@/lib/i18n";

export default function DiasTab({
  trip,
  selected,
  onSelect,
}: {
  trip: Trip;
  selected: number;
  onSelect: (i: number) => void;
}) {
  const { t } = useT();
  const today = todayIndex(trip);
  const day = trip.days[selected];
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingCity, setEditingCity] = useState(false);

  useEffect(() => { setEditingCity(false); }, [selected]);

  if (trip.days.length === 0) {
    return (
      <>
        <Header title={t("dias.title")} subtitle={t("dias.nodays_subtitle")} />
        <div style={{ padding: "0 16px 20px", color: C.inkSoft, fontSize: 13.5, lineHeight: 1.6 }}>
          {t("dias.nodays_body")}
        </div>
        <div style={{ padding: "0 16px" }}>
          <button
            onClick={() => setShowAddDay(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              border: `1.5px dashed ${C.rose}`,
              borderRadius: 16,
              padding: "14px 0",
              background: "#FFF5F3",
              color: C.rose,
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
            {t("dias.addFirstDay")}
          </button>
        </div>
        {showAddDay && <AddDayDialog trip={trip} onClose={() => setShowAddDay(false)} />}
      </>
    );
  }

  return (
    <div>
      <Header title={t("dias.title")} subtitle={t("dias.subtitle", { n: trip.days.length })} />

      {/* Day selector */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 12px" }}>
        {trip.days.map((d, i) => {
          const on = i === selected;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(i)}
              style={{
                flexShrink: 0,
                width: 58,
                borderRadius: 16,
                cursor: "pointer",
                border: on ? "none" : `1px solid ${C.line}`,
                background: on ? C.rose : C.card,
                color: on ? "#fff" : C.ink,
                padding: "9px 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", opacity: 0.8 }}>{fmt(d.date, { weekday: "short" })}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600 }}>{fmt(d.date, { day: "numeric" })}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: on ? "rgba(255,255,255,.9)" : C.inkSoft }}>{i === today ? t("dias.today") : t("dias.dayShort", { n: i + 1 })}</div>
            </button>
          );
        })}

        {/* Add day chip */}
        <button
          onClick={() => setShowAddDay(true)}
          style={{
            flexShrink: 0,
            width: 50,
            borderRadius: 16,
            cursor: "pointer",
            border: `1.5px dashed ${C.line}`,
            background: "transparent",
            color: C.inkSoft,
            padding: "9px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Plus size={16} color={C.inkSoft} />
          <span style={{ fontSize: 9, fontWeight: 700 }}>{t("dias.day")}</span>
        </button>
      </div>

      {/* Day header */}
      <div style={{ padding: "0 16px 8px" }}>
        {editingCity ? (
          <input
            autoFocus
            defaultValue={day.city && day.city !== "—" ? day.city : ""}
            placeholder={t("dias.dayN", { n: selected + 1 })}
            onBlur={(e) => {
              updateDayCity(trip.id, day.id, e.target.value.trim());
              setEditingCity(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditingCity(false);
            }}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: 22,
              border: "none",
              borderBottom: `2px solid ${C.rose}`,
              outline: "none",
              padding: "0 0 2px",
              background: "transparent",
              color: C.ink,
              width: "100%",
              marginBottom: 2,
            }}
          />
        ) : (
          <h2
            onClick={() => setEditingCity(true)}
            title={t("dias.editHint")}
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: "0 0 2px", cursor: "text" }}
          >
            {day.city && day.city !== "—" ? day.city : t("dias.dayN", { n: selected + 1 })}
          </h2>
        )}
        <div style={{ color: C.inkSoft, fontSize: 13.5 }}>{cap(fmt(day.date, { weekday: "long", day: "numeric", month: "long" }))}</div>
      </div>

      {/* Timeline */}
      <div style={{ padding: "8px 16px" }}>
        {day.items.length === 0 && (
          <div style={{ color: C.inkSoft, fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
            {t("dias.noItems")}
          </div>
        )}
        {day.items.map((it, i) => (
          <TimelineItem
            key={it.id}
            it={it}
            last={i === day.items.length - 1}
            onDelete={() => deleteItemFromDay(trip.id, day.id, it.id)}
          />
        ))}

        {/* Add item button */}
        <button
          onClick={() => setShowAddItem(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: day.items.length > 0 ? 4 : 0,
            border: `1.5px dashed ${C.line}`,
            borderRadius: 14,
            padding: "11px 14px",
            background: "transparent",
            color: C.inkSoft,
            fontFamily: FONT_SANS,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Plus size={16} color={C.inkSoft} />
          {t("dias.addItem")}
        </button>
      </div>

      {showAddDay && <AddDayDialog trip={trip} onClose={() => setShowAddDay(false)} />}
      {showAddItem && day && <AddItemDialog tripId={trip.id} day={day} onClose={() => setShowAddItem(false)} />}
    </div>
  );
}

function TimelineItem({
  it,
  last,
  onDelete,
}: {
  it: ItineraryItem;
  last: boolean;
  onDelete: () => void;
}) {
  const { t } = useT();
  const m = metaFor(it.type);
  const [confirm, setConfirm] = useState(false);

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <m.Icon size={19} color={m.color} />
        </div>
        {!last && <div style={{ flex: 1, width: 2, background: C.line, margin: "4px 0" }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: last ? 0 : 16, minWidth: 0 }}>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 14, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: m.color }}>{m.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 700, color: C.ink }}>
                <Clock size={12} color={C.inkSoft} /> {it.time}
              </span>
              {confirm ? (
                <button
                  onClick={onDelete}
                  style={{ border: "none", background: C.danger, color: "#fff", borderRadius: 8, padding: "2px 7px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                >
                  {t("dias.delete")}
                </button>
              ) : (
                <button
                  onClick={() => setConfirm(true)}
                  aria-label={t("dias.delete")}
                  style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                >
                  <Trash2 size={13} color={C.inkSoft} />
                </button>
              )}
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14.5, margin: "6px 0 4px" }}>{it.title}</div>
          {it.detail && <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>{it.detail}</div>}
          {it.note && <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5, marginTop: 4, fontStyle: "italic" }}>{it.note}</div>}
        </div>
      </div>
    </div>
  );
}
