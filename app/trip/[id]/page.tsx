"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import BottomNav, { type TabId } from "@/components/BottomNav";
import InicioTab from "@/components/tabs/InicioTab";
import DiasTab from "@/components/tabs/DiasTab";
import MapaTab from "@/components/tabs/MapaTab";
import FrasesTab from "@/components/tabs/FrasesTab";
import AyudaTab from "@/components/tabs/AyudaTab";
import { useTrip } from "@/lib/store";
import { C } from "@/lib/theme";
import { todayIndex } from "@/lib/format";

export default function TripPage() {
  const params = useParams<{ id: string }>();
  const { trip, ready } = useTrip(params.id);
  const [tab, setTab] = useState<TabId>("inicio");
  const [day, setDay] = useState(0);

  if (!ready) {
    return (
      <PhoneFrame>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.inkSoft }}>Cargando…</div>
      </PhoneFrame>
    );
  }

  if (!trip) {
    return (
      <PhoneFrame>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
          <div style={{ color: C.ink, fontWeight: 700 }}>No encontramos este viaje.</div>
          <Link href="/" style={{ color: C.rose, fontWeight: 700, textDecoration: "none" }}>← Volver a mis viajes</Link>
        </div>
      </PhoneFrame>
    );
  }

  const openDay = (i: number) => {
    setDay(i >= 0 ? i : 0);
    setTab("dias");
  };

  return (
    <PhoneFrame>
      {/* Profile button — top right */}
      <Link
        href="/"
        aria-label="Ver mi perfil"
        style={{ position: "absolute", top: 14, right: 14, zIndex: 10, width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px -6px rgba(44,26,46,.4)" }}
      >
        <User size={20} color={C.ink} />
      </Link>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", paddingBottom: 116 }}>
        {tab === "inicio" && <InicioTab trip={trip} onTab={setTab} onOpenDay={openDay} />}
        {tab === "dias" && <DiasTab trip={trip} selected={Math.min(day, Math.max(0, trip.days.length - 1))} onSelect={setDay} />}
        {tab === "mapa" && <MapaTab trip={trip} />}
        {tab === "frases" && <FrasesTab trip={trip} />}
        {tab === "ayuda" && <AyudaTab trip={trip} />}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </PhoneFrame>
  );
}
