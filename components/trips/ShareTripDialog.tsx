"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Share2, X } from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { getOrCreateShareCode } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function ShareTripDialog({
  tripId,
  onClose,
}: {
  tripId: string;
  onClose: () => void;
}) {
  const { t } = useT();
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrCreateShareCode(tripId).then(setCode);
  }, [tripId]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${C.dusk}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Share2 size={18} color={C.dusk} />
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink }}>
              {t("share.modalTitle")}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${C.line}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        {/* Code */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            {t("share.codeLabel")}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              flex: 1, background: C.cream, border: `1.5px solid ${C.line}`,
              borderRadius: 14, padding: "14px 18px",
              fontFamily: "monospace", fontSize: 26, fontWeight: 800,
              letterSpacing: 6, color: C.ink, textAlign: "center",
              minHeight: 58, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {code ?? <span style={{ fontSize: 13, fontWeight: 400, color: C.inkSoft, letterSpacing: 0 }}>{t("share.generating")}</span>}
            </div>
            <button
              onClick={handleCopy}
              disabled={!code}
              style={{
                height: 58, paddingInline: 18, borderRadius: 14,
                border: "none", cursor: code ? "pointer" : "default",
                background: copied ? C.dusk : C.rose,
                color: "#fff", fontWeight: 700, fontSize: 14,
                display: "flex", alignItems: "center", gap: 7,
                transition: "background 0.2s",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t("share.copied") : t("share.copyCode")}
            </button>
          </div>
        </div>

        {/* Info */}
        <p style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6, margin: 0, fontFamily: FONT_SANS }}>
          {t("share.info")}
        </p>
      </div>
    </div>
  );
}
