"use client";

import { useState } from "react";
import { Plus, LogOut, MapPin } from "lucide-react";
import Image from "next/image";
import PhoneFrame from "@/components/PhoneFrame";
import TripCard from "@/components/trips/TripCard";
import NewTripDialog from "@/components/trips/NewTripDialog";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import { useTrips, useUser, signOut } from "@/lib/store";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { useT } from "@/lib/i18n";

export default function Home() {
  const { trips, ready, removeTrip } = useTrips();
  const user = useUser();
  const { t } = useT();
  const [dialog, setDialog] = useState(false);

  return (
    <PhoneFrame bg="linear-gradient(180deg,#FBF4EE 0%,#F4E6DE 100%)">
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto" }}>

        {/* Profile header */}
        <div style={{ padding: "48px 20px 24px", background: "linear-gradient(180deg,rgba(224,101,79,0.08) 0%,transparent 100%)" }}>
          {/* Avatar + sign-out */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={60}
                height={60}
                style={{ borderRadius: 20, objectFit: "cover", flexShrink: 0, boxShadow: "0 8px 20px -6px rgba(44,26,46,0.25)" }}
              />
            ) : (
              <div style={{ width: 60, height: 60, borderRadius: 20, background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(224,101,79,0.45)", flexShrink: 0, fontFamily: FONT_DISPLAY, fontSize: 24, color: "#fff" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: C.ink, lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ color: C.inkSoft, fontSize: 13, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={12} />
                {ready
                  ? (trips.length === 1 ? t("home.tripCount_one") : t("home.tripCount", { n: trips.length }))
                  : t("home.loading")}
              </div>
            </div>
            <PushNotificationToggle />
            <button
              onClick={signOut}
              aria-label={t("home.signOut")}
              style={{ width: 36, height: 36, borderRadius: 12, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <LogOut size={16} color={C.inkSoft} />
            </button>
          </div>

          {/* Stat pills */}
          {ready && trips.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.rose }}>{trips.length}</span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>{t("home.stat_trips")}</span>
              </div>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.dusk }}>
                  {trips.reduce((s, tr) => s + (tr.days?.length ?? 0), 0)}
                </span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>{t("home.stat_days")}</span>
              </div>
              <div style={statPill}>
                <span style={{ fontWeight: 700, color: C.plum }}>
                  {trips.reduce((s, tr) => s + (tr.cities?.length ?? 0), 0)}
                </span>
                <span style={{ color: C.inkSoft, fontSize: 11 }}>{t("home.stat_cities")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Trips section */}
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: C.ink, margin: 0 }}>{t("home.myTrips")}</h2>
          </div>

          {!ready ? (
            <div style={{ color: C.inkSoft, fontSize: 14, padding: "20px 0" }}>{t("home.loading")}</div>
          ) : trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: C.inkSoft }}>
              <div style={{ fontSize: 14.5, marginBottom: 14 }}>{t("home.noTrips")}</div>
              <button onClick={() => setDialog(true)} style={btnPrimary}>
                <Plus size={18} /> {t("home.createFirst")}
              </button>
            </div>
          ) : (
            <>
              {trips.map((tr) => (
                <TripCard key={tr.id} trip={tr} onDelete={removeTrip} />
              ))}
              <button onClick={() => setDialog(true)} style={{ ...btnPrimary, width: "100%", marginTop: 4 }}>
                <Plus size={18} /> {t("home.newTrip")}
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
