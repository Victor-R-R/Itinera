"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, CalendarDays, MapPin } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY } from "@/lib/theme";
import { fmt } from "@/lib/format";
import { deleteTrip } from "@/lib/store";
import EditTripDialog from "./EditTripDialog";
import type { Trip } from "@/lib/types";

export default function TripCard({ trip }: { trip: Trip }) {
  const [editing, setEditing] = useState(false);

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sileo.action({
      title: "¿Eliminar viaje?",
      description: trip.title,
      button: {
        title: "Eliminar",
        onClick: () => deleteTrip(trip.id),
      },
    });
  };

  const onEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  };

  return (
    <>
      <Link
        href={`/trip/${trip.id}`}
        style={{ display: "block", textDecoration: "none", color: C.ink, borderRadius: 20, overflow: "hidden", background: C.card, border: `1px solid ${C.line}`, marginBottom: 14 }}
      >
        <div style={{ height: 76, background: `linear-gradient(120deg, ${trip.theme.from}, ${trip.theme.mid}, ${trip.theme.to})`, position: "relative" }}>
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
            <button
              onClick={onEdit}
              aria-label="Editar viaje"
              style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Pencil size={15} color={C.ink} />
            </button>
            <button
              onClick={onDelete}
              aria-label="Eliminar viaje"
              style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Trash2 size={15} color={C.danger} />
            </button>
          </div>
          {trip.tagline && (
            <span style={{ position: "absolute", left: 14, bottom: 10, color: "#fff", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.95 }}>{trip.tagline}</span>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, margin: "0 0 2px" }}>{trip.title}</h3>
          {trip.travelers && <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>{trip.travelers}</div>}
          <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: C.inkSoft, fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={14} color={C.amber} /> {trip.country}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <CalendarDays size={14} color={C.dusk} /> {fmt(trip.startDate, { day: "numeric", month: "short" })} – {fmt(trip.endDate, { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </Link>

      {editing && <EditTripDialog trip={trip} onClose={() => setEditing(false)} />}
    </>
  );
}
