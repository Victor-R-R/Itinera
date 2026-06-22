"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { C } from "@/lib/theme";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

export default function PushNotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(ok);
    if (!ok) return;

    setPermission(Notification.permission);

    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub))
    );
  }, []);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const enable = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // iOS requires requestPermission() as the FIRST await after user gesture.
      // Any prior await (e.g. SW registration) breaks the gesture context on iOS
      // and causes the permission request to fail silently.
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        showError("Activa las notificaciones en Ajustes");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY no configurada en Vercel");
        showError("Notificaciones no disponibles");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });

      if (res.ok) {
        setSubscribed(true);
        setRinging(true);
        setTimeout(() => setRinging(false), 700);
      } else {
        showError("Error al activar. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("[push] enable error:", err);
      showError("Error al activar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
      setSubscribed(false);
    } catch (err) {
      console.error("[push] disable error:", err);
      showError("Error al desactivar");
    } finally {
      setLoading(false);
    }
  };

  if (!supported || permission === "denied") return null;

  return (
    <>
      <style>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0deg); }
          15%       { transform: rotate(-18deg); }
          35%       { transform: rotate(18deg); }
          55%       { transform: rotate(-10deg); }
          75%       { transform: rotate(10deg); }
        }
        .bell-ringing { animation: bell-ring 0.7s ease-in-out; }
        @keyframes bell-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .bell-shake { animation: bell-shake 0.4s ease-in-out; }
      `}</style>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button
          onClick={subscribed ? disable : enable}
          disabled={loading}
          aria-label={subscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
          title={subscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: `1.5px solid ${errorMsg ? "#f87171" : subscribed ? C.rose : C.line}`,
            background: errorMsg
              ? "rgba(248,113,113,0.1)"
              : subscribed
              ? `${C.rose}18`
              : "rgba(255,255,255,0.7)",
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: loading ? 0.45 : 1,
            transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s, opacity 0.2s",
            boxShadow: subscribed && !errorMsg ? `0 0 0 3px ${C.rose}22` : "none",
          }}
        >
          <span
            className={ringing ? "bell-ringing" : errorMsg ? "bell-shake" : undefined}
            style={{ display: "flex" }}
          >
            {subscribed ? (
              <Bell size={16} color={errorMsg ? "#f87171" : C.rose} fill={errorMsg ? "#f87171" : C.rose} />
            ) : (
              <BellOff size={16} color={errorMsg ? "#f87171" : C.inkSoft} />
            )}
          </span>
        </button>

        {errorMsg && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "#1c1c1e",
              color: "#f87171",
              fontSize: 11,
              fontWeight: 500,
              padding: "4px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              border: "1px solid rgba(248,113,113,0.3)",
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            {errorMsg}
          </div>
        )}
      </div>
    </>
  );
}
