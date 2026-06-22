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

  const enable = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });

      if (res.ok) setSubscribed(true);
    } catch (err) {
      console.error("[push] enable error:", err);
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (!supported || permission === "denied") return null;

  return (
    <button
      onClick={subscribed ? disable : enable}
      disabled={loading}
      aria-label={subscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
      title={subscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        border: `1px solid ${subscribed ? C.rose : C.line}`,
        background: subscribed ? `${C.rose}15` : "#fff",
        cursor: loading ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: loading ? 0.6 : 1,
        transition: "all 0.2s",
      }}
    >
      {subscribed ? (
        <Bell size={16} color={C.rose} fill={C.rose} />
      ) : (
        <Bell size={16} color={C.inkSoft} />
      )}
    </button>
  );
}
