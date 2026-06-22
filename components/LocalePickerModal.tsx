"use client";

import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";

export default function LocalePickerModal({ onPick }: { onPick: (locale: string) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "linear-gradient(160deg, #FBF4EE 0%, #F4E6DE 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 28 }}>🌍</div>

      <h1
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 24,
          color: C.ink,
          textAlign: "center",
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}
      >
        Elige tu idioma
      </h1>
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: 15,
          color: C.inkSoft,
          textAlign: "center",
          margin: "0 0 40px",
        }}
      >
        Choisis ta langue
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 320 }}>
        <button
          onClick={() => onPick("es")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: `2px solid ${C.line}`,
            borderRadius: 20,
            padding: "18px 24px",
            background: "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: "0 2px 12px -4px rgba(44,26,46,0.10)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.rose;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 18px -4px ${C.rose}44`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.line;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px -4px rgba(44,26,46,0.10)";
          }}
        >
          <span style={{ fontSize: 36, lineHeight: 1 }}>🇪🇸</span>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>Español</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Castellano</div>
          </div>
        </button>

        <button
          onClick={() => onPick("fr")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: `2px solid ${C.line}`,
            borderRadius: 20,
            padding: "18px 24px",
            background: "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: "0 2px 12px -4px rgba(44,26,46,0.10)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.dusk;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 18px -4px ${C.dusk}44`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.line;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px -4px rgba(44,26,46,0.10)";
          }}
        >
          <span style={{ fontSize: 36, lineHeight: 1 }}>🇫🇷</span>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>Français</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>France, Belgique, Suisse</div>
          </div>
        </button>
      </div>
    </div>
  );
}
