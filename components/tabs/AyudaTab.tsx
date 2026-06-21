"use client";

import { Phone, Mail, ShieldCheck, LifeBuoy, CreditCard, Building2, type LucideIcon } from "lucide-react";
import { C, FONT_DISPLAY } from "@/lib/theme";
import { Header } from "@/components/ui/Sections";
import type { Trip, Contact, ContactKind } from "@/lib/types";

const ICON: Record<ContactKind, LucideIcon> = {
  emergency: LifeBuoy,
  insurance: ShieldCheck,
  email: Mail,
  consulate: Building2,
  card: CreditCard,
  other: Phone,
};
const COLOR: Record<ContactKind, string> = {
  emergency: C.danger,
  insurance: C.rose,
  email: C.dusk,
  consulate: C.plum,
  card: C.amber,
  other: C.dusk,
};

function href(c: Contact) {
  return c.kind === "email" ? `mailto:${c.value}` : `tel:${c.value.replace(/\s/g, "")}`;
}

export default function AyudaTab({ trip }: { trip: Trip }) {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#CC4435,#E0654F)", color: "#fff", padding: "48px 22px 22px", borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>En caso de emergencia</div>
        <a href={`tel:${trip.emergencyNumber}`} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, textDecoration: "none", color: "#fff" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{trip.emergencyNumber}</div>
            <div style={{ fontSize: 12.5, opacity: 0.92 }}>{trip.emergencyLabel}</div>
          </div>
        </a>
      </div>

      <Header title="Asistencia y contactos" subtitle="Toca para llamar o escribir" noTop />

      <div style={{ padding: "0 16px 8px" }}>
        {trip.contacts.length === 0 ? (
          <div style={{ color: C.inkSoft, fontSize: 13.5 }}>Añade contactos útiles: seguro, consulado, bloqueo de tarjeta…</div>
        ) : (
          trip.contacts.map((c) => {
            const Icon = ICON[c.kind];
            const col = COLOR[c.kind];
            return (
              <a key={c.id} href={href(c)} style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 14, marginBottom: 10, textDecoration: "none", color: C.ink }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={19} color={col} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</div>
                  {c.note && <div style={{ fontSize: 12, color: C.inkSoft }}>{c.note}</div>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: col, flexShrink: 0, textAlign: "right" }}>{c.value}</div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
