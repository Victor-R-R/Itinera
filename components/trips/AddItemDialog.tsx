"use client";

import { useState, useRef, useCallback } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { addItemToDay } from "@/lib/store";
import { uid } from "@/lib/format";
import { TYPE_META } from "@/lib/itinerary";
import type { ItemType, TripDay } from "@/lib/types";

const TYPES: ItemType[] = ["flight", "hotel", "activity", "transfer", "free"];

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

type Suggestion = { id: string; label: string; sublabel: string };

const searchNominatim = async (q: string): Promise<Suggestion[]> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json() as Array<{ place_id: number; display_name: string; address?: Record<string, string> }>;
  return data.map((r) => {
    const parts = r.display_name.split(", ");
    return {
      id: String(r.place_id),
      label: parts.slice(0, 2).join(", "),
      sublabel: parts.slice(2).join(", "),
    };
  });
};

export default function AddItemDialog({
  tripId,
  day,
  onClose,
}: {
  tripId: string;
  day: TripDay;
  onClose: () => void;
}) {
  const [type, setType] = useState<ItemType>("activity");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLocationChange = useCallback((val: string) => {
    setLocation(val);
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
  }, []);

  const pickSuggestion = useCallback((s: Suggestion) => {
    setLocation(`${s.label}, ${s.sublabel}`.replace(/, $/, ""));
    setSuggestions([]);
    setShowSugg(false);
  }, []);

  const submit = () => {
    addItemToDay(tripId, day.id, {
      id: uid(),
      type,
      time: time.trim() || "—",
      title: title.trim(),
      detail: detail.trim() || undefined,
      note: note.trim() || undefined,
      location: location.trim() || undefined,
    });
    sileo.success({ title: TYPE_META[type].label, description: title.trim() });
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>
            Añadir reserva
          </h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        {/* Type picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Tipo</label>
          <div style={{ display: "flex", gap: 6 }}>
            {TYPES.map((t) => {
              const m = TYPE_META[t];
              const on = t === type;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: on ? `2px solid ${m.color}` : `1px solid ${C.line}`,
                    background: on ? m.bg : "#fff",
                    padding: "9px 4px 7px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  <m.Icon size={18} color={m.color} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: m.color,
                      textAlign: "center",
                      lineHeight: 1.2,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: "0 0 110px" }}>
              <label style={labelStyle}>Hora</label>
              <input
                style={inputStyle}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:30"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Título *</label>
              <input
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Vuelo Madrid–JFK"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Detalle</label>
            <input
              style={inputStyle}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Número de vuelo, dirección, horario…"
            />
          </div>

          <div>
            <label style={labelStyle}>Nota</label>
            <input
              style={inputStyle}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tip, duración, recordatorio…"
            />
          </div>

          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 2 }}>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={11} color={C.dusk} />
              Lugar en el mapa
              <span style={{ fontSize: 10, fontWeight: 600, color: C.inkSoft, marginLeft: 2 }}>(opcional · se añade en /mapa)</span>
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative" }}>
                <input
                  style={inputStyle}
                  value={location}
                  onChange={(e) => onLocationChange(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSugg(true); }}
                  onBlur={() => { blurRef.current = setTimeout(() => setShowSugg(false), 200); }}
                  placeholder="Aeropuerto JFK, Hotel Marriott Times Square…"
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
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: `1px solid ${C.line}`,
                    borderRadius: 12,
                    boxShadow: "0 8px 24px -4px rgba(44,26,46,.18)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onMouseDown={(e) => { e.preventDefault(); if (blurRef.current) clearTimeout(blurRef.current); pickSuggestion(s); }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontFamily: FONT_SANS,
                        borderBottom: `1px solid ${C.line}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#faf7f5"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{s.label}</span>
                      {s.sublabel && (
                        <span style={{ fontSize: 11, color: C.inkSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {s.sublabel}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!title.trim()}
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
            cursor: title.trim() ? "pointer" : "not-allowed",
            background: title.trim() ? C.rose : "#D9C7C0",
          }}
        >
          Añadir al itinerario
        </button>
      </div>
    </div>
  );
}
