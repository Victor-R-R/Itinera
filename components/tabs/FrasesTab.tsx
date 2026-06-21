"use client";

import { useMemo, useState } from "react";
import { Search, Volume2 } from "lucide-react";
import { C, FONT_SANS } from "@/lib/theme";
import { speak } from "@/lib/format";
import { Header } from "@/components/ui/Sections";
import type { Trip } from "@/lib/types";

export default function FrasesTab({ trip }: { trip: Trip }) {
  const cats = useMemo(
    () => ["Todas", ...Array.from(new Set(trip.phrases.map((p) => p.category)))],
    [trip.phrases]
  );
  const [cat, setCat] = useState("Todas");
  const [q, setQ] = useState("");

  const list = trip.phrases.filter(
    (p) =>
      (cat === "Todas" || p.category === cat) &&
      (q === "" || (p.source + p.target).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <Header title="Frases útiles" subtitle="Toca 🔊 para escuchar la pronunciación" />

      <div style={{ padding: "0 16px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "10px 12px" }}>
          <Search size={16} color={C.inkSoft} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar una frase…"
            style={{ border: "none", outline: "none", flex: 1, fontFamily: FONT_SANS, fontSize: 14, color: C.ink, background: "transparent" }}
          />
        </div>
      </div>

      <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px 12px" }}>
        {cats.map((c) => {
          const on = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ flexShrink: 0, border: on ? "none" : `1px solid ${C.line}`, background: on ? C.ink : C.card, color: on ? "#fff" : C.inkSoft, fontWeight: 700, fontSize: 12.5, padding: "7px 14px", borderRadius: 999, cursor: "pointer" }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "0 16px" }}>
        {list.map((p) => (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 3 }}>{p.source}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{p.target}</div>
              </div>
              <button
                onClick={() => speak(p.target, trip.speakLang)}
                aria-label="Escuchar"
                style={{ flexShrink: 0, border: "none", background: "#EAF1F6", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Volume2 size={18} color={C.dusk} />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div style={{ textAlign: "center", color: C.inkSoft, padding: 30, fontSize: 14 }}>Ninguna frase coincide con tu búsqueda.</div>
        )}
      </div>
    </div>
  );
}
