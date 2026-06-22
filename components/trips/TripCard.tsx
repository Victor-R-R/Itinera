"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, CalendarDays, MapPin, Share2, Users, LogOut } from "lucide-react";
import { sileo } from "sileo";
import { C, FONT_DISPLAY } from "@/lib/theme";
import { fmt } from "@/lib/format";
import { useT } from "@/lib/i18n";
import EditTripDialog from "./EditTripDialog";
import ShareTripDialog from "./ShareTripDialog";
import type { Trip } from "@/lib/types";

export default function TripCard({
  trip,
  isCollaborator,
  onDelete,
  onLeave,
}: {
  trip: Trip;
  isCollaborator: boolean;
  onDelete: (id: string) => Promise<void>;
  onLeave: (id: string) => Promise<void>;
}) {
  const { t, dateLocale } = useT();
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);

  const onDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sileo.action({
      title: t("tripCard.deleteTitle"),
      description: trip.title,
      button: { title: t("tripCard.deleteButton"), onClick: () => onDelete(trip.id) },
    });
  };

  const onLeaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sileo.action({
      title: t("tripCard.leaveTitle"),
      description: trip.title,
      button: { title: t("tripCard.leaveButton"), onClick: () => onLeave(trip.id) },
    });
  };

  const onEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  };

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSharing(true);
  };

  return (
    <>
      <Link
        href={`/trip/${trip.id}`}
        style={{ display: "block", textDecoration: "none", color: C.ink, borderRadius: 20, overflow: "hidden", background: C.card, border: `1px solid ${C.line}`, marginBottom: 14 }}
      >
        <div style={{
          height: 110, position: "relative",
          background: trip.coverImage
            ? `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.48)), url(${trip.coverImage})`
            : `linear-gradient(120deg, ${trip.theme.from}, ${trip.theme.mid}, ${trip.theme.to})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }}>
          {/* Shared badge */}
          {isCollaborator && (
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "4px 8px" }}>
              <Users size={11} color={C.plum} />
              <span style={{ fontSize: 10, fontWeight: 800, color: C.plum, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {t("tripCard.sharedBadge")}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
            {!isCollaborator && (
              <>
                <button
                  onClick={onShare}
                  aria-label={t("tripCard.share")}
                  style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Share2 size={15} color={C.dusk} />
                </button>
                <button
                  onClick={onEdit}
                  aria-label={t("tripCard.edit")}
                  style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Pencil size={15} color={C.ink} />
                </button>
                <button
                  onClick={onDeleteClick}
                  aria-label={t("tripCard.delete")}
                  style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Trash2 size={15} color={C.danger} />
                </button>
              </>
            )}
            {isCollaborator && (
              <button
                onClick={onLeaveClick}
                aria-label={t("tripCard.leaveTrip")}
                style={{ width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <LogOut size={15} color={C.danger} />
              </button>
            )}
          </div>

          {trip.tagline && (
            <span style={{ position: "absolute", left: 14, bottom: 10, color: "#fff", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.95 }}>
              {trip.tagline}
            </span>
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
              <CalendarDays size={14} color={C.dusk} />
              {fmt(trip.startDate, { day: "numeric", month: "short" }, dateLocale)} – {fmt(trip.endDate, { day: "numeric", month: "short" }, dateLocale)}
            </span>
          </div>
        </div>
      </Link>

      {editing && <EditTripDialog trip={trip} onClose={() => setEditing(false)} />}
      {sharing && <ShareTripDialog tripId={trip.id} onClose={() => setSharing(false)} />}
    </>
  );
}
