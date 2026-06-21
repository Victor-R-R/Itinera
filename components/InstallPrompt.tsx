"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download } from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";

type Platform = "ios" | "android" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "itinera-install-dismissed";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [visible, setVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show inside installed standalone app
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Don't show if dismissed within TTL
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_TTL_MS) return;

    // Register service worker (required for Android install prompt)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) {
      // Only Safari can install PWAs on iOS
      const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
      if (!isSafari) return;
      setPlatform("ios");
      // Slight delay so the page settles before the banner appears
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    } else if (isAndroid) {
      setPlatform("android");
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
    setShowGuide(false);
  }, []);

  const handleInstall = useCallback(async () => {
    if (platform === "ios") {
      setShowGuide(true);
      return;
    }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
      setDeferredPrompt(null);
    }
  }, [platform, deferredPrompt]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      {showGuide && (
        <div
          onClick={() => setShowGuide(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,26,46,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}

      {/* iOS step-by-step guide */}
      {showGuide && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 412,
            background: C.card,
            borderRadius: "24px 24px 0 0",
            padding: "20px 20px 40px",
            zIndex: 1000,
            boxShadow: "0 -8px 32px rgba(44,26,46,0.15)",
          }}
        >
          {/* Handle bar */}
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: C.line,
              margin: "0 auto 20px",
            }}
          />

          <h3
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 20,
              fontWeight: 700,
              color: C.ink,
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            Instalar Itinera
          </h3>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: 14,
              color: C.inkSoft,
              textAlign: "center",
              marginBottom: 28,
              lineHeight: 1.5,
            }}
          >
            Sigue estos pasos en Safari para añadir la app a tu pantalla de
            inicio
          </p>

          {[
            {
              icon: "⬆️",
              title: "Toca Compartir",
              desc: 'Pulsa el icono de compartir "↑" en la barra inferior de Safari',
            },
            {
              icon: "📱",
              title: "Añadir a pantalla de inicio",
              desc: 'Desliza hacia abajo en el menú y selecciona "Añadir a pantalla de inicio"',
            },
            {
              icon: "✅",
              title: "Confirmar",
              desc: 'Toca "Añadir" en la esquina superior derecha',
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: C.cream,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.ink,
                    marginBottom: 2,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 13,
                    color: C.inkSoft,
                    lineHeight: 1.45,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={dismiss}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: `1px solid ${C.line}`,
              background: "transparent",
              fontFamily: FONT_SANS,
              fontSize: 15,
              fontWeight: 600,
              color: C.inkSoft,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Entendido
          </button>
        </div>
      )}

      {/* Install banner */}
      {!showGuide && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: 380,
            background: C.card,
            borderRadius: 20,
            padding: "12px 14px",
            boxShadow:
              "0 8px 32px -4px rgba(44,26,46,0.18), 0 2px 8px rgba(44,26,46,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 100,
            border: `1px solid ${C.line}`,
          }}
        >
          {/* App icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${C.rose} 0%, ${C.amber} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            ✈️
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 15,
                color: C.ink,
                marginBottom: 1,
              }}
            >
              Instalar Itinera
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 12,
                color: C.inkSoft,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {platform === "ios"
                ? "Añadir a pantalla de inicio"
                : "Instalar como app nativa"}
            </div>
          </div>

          {/* Install CTA */}
          <button
            onClick={handleInstall}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              borderRadius: 10,
              border: "none",
              background: C.rose,
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Download size={14} />
            Instalar
          </button>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            aria-label="Cerrar"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: `1px solid ${C.line}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <X size={14} color={C.inkSoft} />
          </button>
        </div>
      )}
    </>
  );
}
