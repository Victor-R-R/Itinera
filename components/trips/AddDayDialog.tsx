"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { addDayToTrip } from "@/lib/store";
import { uid } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Trip } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${C.line}`,
  borderRadius: 12,
  padding: "11px 12px",
  fontFamily: FONT_SANS,
  fontSize: 14,
  color: C.ink,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: C.inkSoft,
  marginBottom: 5,
  marginTop: 4,
  display: "block",
};

const nextDayAfter = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export default function AddDayDialog({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const { t } = useT();
  const suggested =
    trip.days.length > 0
      ? nextDayAfter(trip.days[trip.days.length - 1].date)
      : trip.startDate;

  const [date, setDate] = useState(suggested);
  const [city, setCity] = useState("");

  const submit = () => {
    const cityName = city.trim() || "—";
    addDayToTrip(trip.id, { id: uid(), date, city: cityName, items: [] });
    sileo.success({ title: t("addDay.successTitle"), description: cityName !== "—" ? cityName : date });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(44,26,46,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 24,
          padding: "22px 22px 28px",
          boxShadow: "0 30px 70px -20px rgba(44,26,46,.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>{t("addDay.title")}</h2>
          <button onClick={onClose} aria-label={t("addDay.close")} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelStyle}>{t("addDay.labelDate")}</label>
            <input
              type="date"
              style={inputStyle}
              value={date}
              min={trip.startDate}
              max={trip.endDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("addDay.labelCity")}</label>
            <input
              style={inputStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("addDay.phCity")}
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!date}
          style={{
            width: "100%",
            marginTop: 20,
            border: "none",
            borderRadius: 14,
            padding: "13px 0",
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            cursor: date ? "pointer" : "not-allowed",
            background: date ? C.rose : "#D9C7C0",
          }}
        >
          {t("addDay.add")}
        </button>
      </div>
    </div>
  );
}
