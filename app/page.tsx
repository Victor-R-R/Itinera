"use client";

import { useState } from "react";
import { Plus, RotateCcw, User, MapPin } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import TripCard from "@/components/trips/TripCard";
import NewTripDialog from "@/components/trips/NewTripDialog";
import { useTrips, resetTrips } from "@/lib/store";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";

export default function Home() {
  const { trips, ready } = useTrips();
  const [dialog, setDialog] = useState(false);

  return (
    <PhoneFrame bg="linear-gradient(180deg,#FBF4EE 0%,#F4E6DE 100%)">
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto" }}>

        {/* Profile header */}
        <div style={{ padding: "48px 20px 24px", background: "linear-gradient(180deg,rgba(224,101,79,0.08) 0%,transparent 100%)" }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: 20, background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(224,101,79,0.45)", flexShrink: 0 }}>
              <User size={28} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: C.ink, lineHeight: 1.2 }}>Mi perfil</div>
              <div style={{ color: C.inkSoft, fontSize: 13, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={12} />
                {ready ? `${trips.length} viaje${trips.length !== 1 ? "s" : ""}` : "Cargando…"}
              </div>
            </div>
          </div>

          {/* Stat pills */}
          {ready && trips.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.rose }}>{trips.length}</span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>viajes</span>
              </div>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.dusk }}>
                  {trips.reduce((s, t) => s + (t.days?.length ?? 0), 0)}
                </span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>días</span>
              </div>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.plum }}>
                  {trips.reduce((s, t) => s + (t.cities?.length ?? 0), 0)}
                </span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>ciudades</span>
              </div>
            </div>
          )}
        </div>

        {/* Trips section */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: C.ink, margin: 0 }}>Mis viajes</h2>
            {ready && trips.length > 0 && (
              <button onClick={() => setDialog(true)} style={btnIcon} aria-label="Nuevo viaje">
                <Plus size={18} color={C.rose} />
              </button>
            )}
          </div>

          {!ready ? (
            <div style={{ color: C.inkSoft, fontSize: 14, padding: "20px 0" }}>Cargando…</div>
          ) : trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: C.inkSoft }}>
              <div style={{ fontSize: 14.5, marginBottom: 14 }}>Todavía no tienes viajes.</div>
              <button onClick={() => setDialog(true)} style={btnPrimary}>
                <Plus size={18} /> Crear el primero
              </button>
              <button onClick={resetTrips} style={{ ...btnGhost, marginTop: 10 }}>
                <RotateCcw size={15} /> Cargar viajes de ejemplo
              </button>
            </div>
          ) : (
            <>
              {trips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
              <button onClick={() => setDialog(true)} style={{ ...btnPrimary, width: "100%", marginTop: 4 }}>
                <Plus size={18} /> Nuevo viaje
              </button>
            </>
          )}
        </div>
      </div>

      {dialog && <NewTripDialog onClose={() => setDialog(false)} />}
    </PhoneFrame>
  );
}

const statPill: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: 12,
  padding: "8px 16px",
  fontSize: 15,
  fontWeight: 700,
  minWidth: 60,
};

const btnIcon: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: `1.5px solid ${C.line}`,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  border: "none",
  borderRadius: 14,
  padding: "13px 20px",
  fontSize: 15,
  fontWeight: 700,
  color: "#fff",
  background: C.rose,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: "10px 16px",
  fontSize: 13.5,
  fontWeight: 700,
  color: C.inkSoft,
  background: "#fff",
  cursor: "pointer",
};
