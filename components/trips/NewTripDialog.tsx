"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { createTrip } from "@/lib/store";
import { todayIso } from "@/lib/format";

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
};
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 5, display: "block" };

export default function NewTripDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [travelers, setTravelers] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());

  const submit = () => {
    const trip = createTrip({ title, tagline, travelers, country, startDate, endDate });
    onClose();
    sileo.success({ title: "Viaje creado", description: trip.title });
    router.push(`/trip/${trip.id}`);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(44,26,46,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 30px 70px -20px rgba(44,26,46,.5)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>Nuevo viaje</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

        <button
          onClick={submit}
          disabled={!title.trim()}
          style={{ width: "100%", marginTop: 18, border: "none", borderRadius: 14, padding: "13px 0", fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: "#fff", cursor: title.trim() ? "pointer" : "not-allowed", background: title.trim() ? C.rose : "#D9C7C0" }}
        >
          Crear viaje
        </button>
      </div>
    </div>
  );
}
