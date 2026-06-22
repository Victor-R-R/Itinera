"use client";

import { useState } from "react";
import {
  Phone, Mail, ShieldCheck, LifeBuoy, CreditCard, Building2,
  Plus, Trash2, X, type LucideIcon,
} from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { addContact, deleteContact } from "@/lib/store";
import { uid } from "@/lib/format";
import type { Trip, Contact, ContactKind } from "@/lib/types";
import { useT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { EMERGENCY_LABEL_I18N, CONTACT_LABEL_I18N, getConsulateForLocale } from "@/lib/countries";

// ─── Static maps ─────────────────────────────────────────────────────────────

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

const KIND_ORDER: ContactKind[] = ["insurance", "consulate", "card", "email", "emergency", "other"];

const VALUE_PLACEHOLDER: Record<ContactKind, string> = {
  insurance:  "+34 900 000 000",
  consulate:  "+1 202 000 0000",
  card:       "+34 900 000 000",
  email:      "soporte@ejemplo.com",
  emergency:  "+34 112",
  other:      "+34 000 000 000",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const contactHref = (c: Contact) =>
  c.kind === "email" ? `mailto:${c.value}` : `tel:${c.value.replace(/\s/g, "")}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${C.line}`,
  borderRadius: 10,
  padding: "9px 11px",
  fontFamily: FONT_SANS,
  fontSize: 16,
  color: C.ink,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: 8,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AyudaTab({ trip }: { trip: Trip }) {
  const { t, locale } = useT();

  const tr = (map: Record<string, Partial<Record<"fr", string>>>, text: string) =>
    locale === "es" ? text : (map[text]?.[locale as Exclude<Locale, "es">] ?? text);

  const kindOptions = KIND_ORDER.map((kind) => ({ kind, label: t(`ayuda.kind_${kind}`) }));

  // Derive the consulate at display-time based on current locale + trip country.
  // Used when no consulate is stored in trip.contacts (e.g. existing trips, or
  // trips to the user's home country like España for a French user).
  const hasStoredConsulate = trip.contacts.some((c) => c.kind === "consulate");
  const derivedConsulate = !hasStoredConsulate
    ? getConsulateForLocale(trip.country, locale)
    : undefined;
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<ContactKind>("insurance");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reset = () => {
    setAdding(false);
    setKind("insurance");
    setLabel("");
    setValue("");
    setNote("");
  };

  const save = async () => {
    if (!label.trim() || !value.trim() || saving) return;
    setSaving(true);
    const contact: Contact = {
      id: uid(),
      kind,
      label: label.trim(),
      value: value.trim(),
      note: note.trim() || undefined,
    };
    await addContact(trip.id, contact);
    reset();
    setSaving(false);
  };

  const remove = async (contactId: string) => {
    setDeletingId(contactId);
    await deleteContact(trip.id, contactId);
    setDeletingId(null);
  };

  return (
    <div>
      {/* ── Emergency banner ── */}
      <div style={{ background: "linear-gradient(135deg,#CC4435,#E0654F)", color: "#fff", padding: "48px 22px 22px", borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>
          {t("ayuda.emergency")}
        </div>
        <a
          href={`tel:${trip.emergencyNumber}`}
          style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, textDecoration: "none", color: "#fff" }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>
              {trip.emergencyNumber}
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.92 }}>{tr(EMERGENCY_LABEL_I18N, trip.emergencyLabel)}</div>
          </div>
        </a>
      </div>

      {/* ── Section header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 10px" }}>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.ink }}>
            {t("ayuda.sectionTitle")}
          </div>
          <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 1 }}>{t("ayuda.sectionSubtitle")}</div>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, border: `1.5px solid ${C.dusk}`, borderRadius: 20, padding: "6px 12px", background: "#EAF1F6", cursor: "pointer", fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: 700, color: C.dusk }}
          >
            <Plus size={13} color={C.dusk} />
            {t("ayuda.add")}
          </button>
        )}
      </div>

      {/* ── Add contact form ── */}
      {adding && (
        <div style={{ margin: "0 16px 14px", background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "14px 14px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700, color: C.ink }}>{t("ayuda.newContact")}</span>
            <button onClick={reset} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2 }}>
              <X size={16} color={C.inkSoft} />
            </button>
          </div>

          {/* Kind selector */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {kindOptions.map(({ kind: k, label: l }) => {
              const on = k === kind;
              const col = COLOR[k];
              const KIcon = ICON[k];
              return (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    border: on ? `1.5px solid ${col}` : `1px solid ${C.line}`,
                    borderRadius: 20,
                    padding: "4px 10px",
                    background: on ? col + "15" : "#fff",
                    cursor: "pointer",
                    fontFamily: FONT_SANS,
                    fontSize: 12,
                    fontWeight: on ? 700 : 500,
                    color: on ? col : C.inkSoft,
                  }}
                >
                  <KIcon size={11} color={on ? col : C.inkSoft} />
                  {l}
                </button>
              );
            })}
          </div>

          {/* Inputs */}
          <input
            style={inputStyle}
            placeholder={t("ayuda.namePlaceholder")}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
          <input
            style={inputStyle}
            placeholder={VALUE_PLACEHOLDER[kind]}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={kind === "email" ? "email" : "tel"}
            inputMode={kind === "email" ? "email" : "tel"}
          />
          <input
            style={{ ...inputStyle, marginBottom: 0 }}
            placeholder={t("ayuda.notePlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              onClick={reset}
              style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 0", background: "#fff", cursor: "pointer", fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: C.inkSoft }}
            >
              {t("ayuda.cancel")}
            </button>
            <button
              onClick={save}
              disabled={!label.trim() || !value.trim() || saving}
              style={{ flex: 2, border: "none", borderRadius: 10, padding: "9px 0", background: (!label.trim() || !value.trim() || saving) ? "#D9C7C0" : C.rose, cursor: (!label.trim() || !value.trim() || saving) ? "not-allowed" : "pointer", fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700, color: "#fff" }}
            >
              {saving ? t("ayuda.saving") : t("ayuda.save")}
            </button>
          </div>
        </div>
      )}

      {/* ── Contact list ── */}
      <div style={{ padding: "0 16px 24px" }}>
        {trip.contacts.length === 0 && !adding && !derivedConsulate ? (
          <div style={{ color: C.inkSoft, fontSize: 13.5, paddingTop: 4 }}>
            {t("ayuda.emptyContacts")}
          </div>
        ) : (
          <>
            {derivedConsulate && (() => {
              const Icon = ICON[derivedConsulate.kind as keyof typeof ICON] ?? Building2;
              const col = COLOR[derivedConsulate.kind as keyof typeof COLOR] ?? C.plum;
              return (
                <a
                  key="derived-consulate"
                  href={`tel:${derivedConsulate.value.replace(/\s/g, "")}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "12px 12px", marginBottom: 10, textDecoration: "none", color: C.ink }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={19} color={col} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{derivedConsulate.label}</div>
                    {derivedConsulate.note && (
                      <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 1 }}>{derivedConsulate.note}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: col, flexShrink: 0, textAlign: "right", marginRight: 4 }}>
                    {derivedConsulate.value}
                  </div>
                </a>
              );
            })()}
            {trip.contacts.map((c) => {
              const Icon = ICON[c.kind];
              const col = COLOR[c.kind];
              const isDeleting = deletingId === c.id;
              return (
                <div
                  key={c.id}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "12px 12px", marginBottom: 10, opacity: isDeleting ? 0.4 : 1, transition: "opacity .2s" }}
                >
                  <a
                    href={contactHref(c)}
                    style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: C.ink, flex: 1, minWidth: 0 }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={19} color={col} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{tr(CONTACT_LABEL_I18N, c.label)}</div>
                      {c.note && (
                        <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 1 }}>{c.note}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: col, flexShrink: 0, textAlign: "right", marginRight: 4 }}>
                      {c.value}
                    </div>
                  </a>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={isDeleting}
                    style={{ border: "none", background: "transparent", cursor: isDeleting ? "not-allowed" : "pointer", padding: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    aria-label={t("ayuda.deleteContact")}
                  >
                    <Trash2 size={15} color={C.inkSoft} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
