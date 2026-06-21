"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { updateTrip } from "@/lib/store";
import { generateTripDays } from "@/lib/format";
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

export default function EditTripDialog({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [title, setTitle] = useState(trip.title);
  const [tagline, setTagline] = useState(trip.tagline ?? "");
  const [travelers, setTravelers] = useState(trip.travelers ?? "");
  const [country, setCountry] = useState(trip.country);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [trimOrphans, setTrimOrphans] = useState(false);

  const orphanDays = trip.days.filter((d) => d.date < startDate || d.date > endDate);
  const orphanCount = orphanDays.length;
  const datesChanged = startDate !== trip.startDate || endDate !== trip.endDate;

  const submit = () => {
    updateTrip(trip.id, (t) => {
      let days = trimOrphans
        ? t.days.filter((d) => d.date >= startDate && d.date <= endDate)
        : t.days;

      const removedItemIds = trimOrphans
        ? orphanDays.flatMap((d) => d.items.map((it) => it.id))
        : [];

      const cities = trimOrphans
        ? t.cities.filter((c) => !c.sourceItemId || !removedItemIds.includes(c.sourceItemId))
        : t.cities;

      // Generate days for any date in the new range not already covered
      const existingDates = new Set(days.map((d) => d.date));
      const newDays = generateTripDays(startDate, endDate).filter((d) => !existingDates.has(d.date));
      days = [...days, ...newDays].sort((a, b) => a.date.localeCompare(b.date));

      return {
        ...t,
        title: title.trim() || t.title,
        tagline: tagline.trim() || undefined,
        travelers: travelers.trim() || undefined,
        country: country.trim() || t.country,
        startDate,
        endDate,
        days,
        cities,
      };
    });
    sileo.success({ title: "Cambios guardados", description: title.trim() || trip.title });
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>Editar viaje</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelStyle}>Título *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Costa a costa" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Etiqueta</label>
              <input style={inputStyle} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Luna de miel" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>País</label>
              <input style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Estados Unidos" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Viajeros</label>
            <input style={inputStyle} value={travelers} onChange={(e) => setTravelers(e.target.value)} placeholder="Lucía & Daniel" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Inicio</label>
              <input
                type="date"
                style={inputStyle}
                value={startDate}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartDate(v);
                  if (endDate < v) setEndDate(v);
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fin</label>
              <input
                type="date"
                style={inputStyle}
                value={endDate}
                min={startDate}
                onChange={(e) => { if (e.target.value >= startDate) setEndDate(e.target.value); }}
              />
            </div>
          </div>
        </div>

        {/* Warning: orphan days */}
        {datesChanged && orphanCount > 0 && (
          <div
            style={{
              marginTop: 16,
              borderRadius: 14,
              background: "#FFF8EC",
              border: `1px solid #F5D89A`,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <AlertTriangle size={15} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                <strong>{orphanCount} {orphanCount === 1 ? "día queda" : "días quedan"} fuera del nuevo rango</strong> y{" "}
                {orphanCount === 1 ? "contiene" : "contienen"} actividades ya añadidas.
              </p>
            </div>
            <label
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.danger }}
            >
              <input
                type="checkbox"
                checked={trimOrphans}
                onChange={(e) => setTrimOrphans(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: C.danger, cursor: "pointer" }}
              />
              Eliminar esos días y sus actividades
            </label>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!title.trim()}
          style={{
            width: "100%",
            marginTop: 16,
            border: "none",
            borderRadius: 14,
            padding: "13px 0",
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            cursor: title.trim() ? "pointer" : "not-allowed",
            background: title.trim() ? C.rose : "#D9C7C0",
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
