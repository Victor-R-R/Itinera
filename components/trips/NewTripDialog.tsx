"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Plane, Car, Train, Ship, MoreHorizontal, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { createTrip } from "@/lib/store";
import { todayIso } from "@/lib/format";
import type { TransportMode } from "@/lib/types";

// ─── Nominatim autocomplete ───────────────────────────────────────────────────

type Suggestion = { id: string; label: string; sublabel: string };

const searchNominatim = async (q: string): Promise<Suggestion[]> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json() as Array<{ place_id: number; display_name: string }>;
  return data.map((r) => {
    const parts = r.display_name.split(", ");
    return { id: String(r.place_id), label: parts.slice(0, 2).join(", "), sublabel: parts.slice(2).join(", ") };
  });
};

function CityInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onInputChange = useCallback((val: string) => {
    onChange(val);
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 3) { setShowSugg(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setShowSugg(true);
      const results = await searchNominatim(val);
      setSuggestions(results);
      setSearching(false);
    }, 500);
  }, [onChange]);

  const pick = useCallback((s: Suggestion) => {
    onChange(`${s.label}, ${s.sublabel}`.replace(/, $/, ""));
    setSuggestions([]);
    setShowSugg(false);
  }, [onChange]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          style={inputStyle}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowSugg(true); }}
          onBlur={() => { blurRef.current = setTimeout(() => setShowSugg(false), 200); }}
          placeholder={placeholder}
          autoComplete="off"
        />
        {searching && (
          <Loader2
            size={14}
            color={C.inkSoft}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", animation: "spin 1s linear infinite" }}
          />
        )}
      </div>
      {showSugg && (suggestions.length > 0 || searching) && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, boxShadow: "0 8px 24px -4px rgba(44,26,46,.18)", zIndex: 200, overflow: "hidden" }}>
          {suggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={(e) => { e.preventDefault(); if (blurRef.current) clearTimeout(blurRef.current); pick(s); }}
              style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "10px 14px", cursor: "pointer", fontFamily: FONT_SANS, borderBottom: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 2 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#faf7f5"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{s.label}</span>
              {s.sublabel && <span style={{ fontSize: 11, color: C.inkSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.sublabel}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Transport modes ──────────────────────────────────────────────────────────

const TRANSPORT_MODES: { mode: TransportMode; label: string; Icon: React.ElementType }[] = [
  { mode: "plane", label: "Avión", Icon: Plane },
  { mode: "car", label: "Coche", Icon: Car },
  { mode: "train", label: "Tren", Icon: Train },
  { mode: "ship", label: "Barco", Icon: Ship },
  { mode: "other", label: "Otro", Icon: MoreHorizontal },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

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
  display: "block",
};

// ─── Dialog ───────────────────────────────────────────────────────────────────

export default function NewTripDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [travelers, setTravelers] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());
  const [transport, setTransport] = useState<TransportMode>("plane");
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const trip = await createTrip({
        title, tagline, travelers, country, startDate, endDate,
        transport,
        originCity: originCity.trim() || undefined,
        destinationCity: destinationCity.trim() || undefined,
      });
      onClose();
      sileo.success({ title: "Viaje creado", description: trip.title });
      router.push(`/trip/${trip.id}`);
    } catch {
      sileo.error({ title: "Error", description: "No se pudo crear el viaje" });
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(44,26,46,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 24, padding: "22px 22px 28px", boxShadow: "0 30px 70px -20px rgba(44,26,46,.5)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>Nuevo viaje</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <div>
            <label style={labelStyle}>Título *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Costa a costa" autoFocus />
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
            <label style={labelStyle}>Medio de transporte</label>
            <div style={{ display: "flex", gap: 6 }}>
              {TRANSPORT_MODES.map(({ mode, label, Icon }) => {
                const on = mode === transport;
                return (
                  <button
                    key={mode}
                    onClick={() => setTransport(mode)}
                    style={{ flex: 1, borderRadius: 12, border: on ? `2px solid ${C.dusk}` : `1px solid ${C.line}`, background: on ? "#EAF1F6" : "#fff", padding: "9px 4px 7px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", transition: "all .15s" }}
                  >
                    <Icon size={18} color={on ? C.dusk : C.inkSoft} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: on ? C.dusk : C.inkSoft, textAlign: "center", lineHeight: 1.2, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Origen</label>
              <CityInput value={originCity} onChange={setOriginCity} placeholder="Madrid" />
            </div>
            <div style={{ paddingBottom: 11, color: C.inkSoft, fontSize: 18, lineHeight: 1 }}>→</div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Destino</label>
              <CityInput value={destinationCity} onChange={setDestinationCity} placeholder="Nueva York" />
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
                onChange={(e) => { const v = e.target.value; setStartDate(v); if (endDate < v) setEndDate(v); }}
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
          disabled={!title.trim() || saving}
          style={{ width: "100%", marginTop: 20, border: "none", borderRadius: 14, padding: "13px 0", fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: "#fff", cursor: title.trim() && !saving ? "pointer" : "not-allowed", background: title.trim() && !saving ? C.rose : "#D9C7C0" }}
        >
          {saving ? "Creando…" : "Crear viaje"}
        </button>
      </div>
    </div>
  );
}
