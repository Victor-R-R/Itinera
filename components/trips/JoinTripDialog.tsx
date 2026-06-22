"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { joinTripByCode } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function JoinTripDialog({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await joinTripByCode(code);
      onClose();
    } catch (err) {
      setError(t("share.joinError"));
    } finally {
      setBusy(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    // Auto-insert dash after 4 chars
    if (v.length === 4 && !v.includes("-")) v = v + "-";
    if (v.length > 9) v = v.slice(0, 9);
    setCode(v);
    setError(null);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(44,26,46,0.45)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 430,
          background: C.card, borderRadius: "24px 24px 0 0",
          padding: "28px 24px 40px",
          boxShadow: "0 -8px 40px rgba(44,26,46,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${C.plum}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} color={C.plum} />
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>
              {t("share.joinTitle")}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, padding: 0, borderRadius: 10, border: `1px solid ${C.line}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder={t("share.joinPlaceholder")}
            autoFocus
            style={{
              width: "100%", boxSizing: "border-box",
              background: C.cream, border: `1.5px solid ${error ? C.danger : C.line}`,
              borderRadius: 14, padding: "14px 18px",
              fontFamily: "monospace", fontSize: 22, fontWeight: 700,
              letterSpacing: 4, color: C.ink, textAlign: "center",
              outline: "none", marginBottom: 8,
            }}
          />

          {error && (
            <div style={{ fontSize: 13, color: C.danger, marginBottom: 12, fontFamily: FONT_SANS }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || code.length < 9}
            style={{
              width: "100%", padding: "14px", borderRadius: 14,
              border: "none", cursor: (busy || code.length < 9) ? "default" : "pointer",
              background: (busy || code.length < 9) ? C.line : C.plum,
              color: (busy || code.length < 9) ? C.inkSoft : "#fff",
              fontWeight: 700, fontSize: 15, fontFamily: FONT_SANS,
              transition: "background 0.2s",
            }}
          >
            {busy ? t("share.joining") : t("share.joinAction")}
          </button>
        </form>
      </div>
    </div>
  );
}
