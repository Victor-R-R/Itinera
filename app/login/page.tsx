"use client";

import { createClient } from "@/lib/supabase/client";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "linear-gradient(160deg,#FBF4EE 0%,#F4E6DE 60%,#EDD5CA 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 340,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          padding: "40px 32px",
          boxShadow: "0 40px 80px -20px rgba(44,26,46,.22)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: "linear-gradient(135deg,#3F6E8C,#7A4A6B,#E0654F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 34,
          }}
        >
          ✈️
        </div>

        <h1
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 32,
            margin: "0 0 6px",
            color: C.ink,
          }}
        >
          Itinera
        </h1>
        <p
          style={{
            color: C.inkSoft,
            fontSize: 14,
            margin: "0 0 32px",
            fontFamily: FONT_SANS,
            lineHeight: 1.5,
          }}
        >
          Organiza tus viajes, día a día.
        </p>

        <button
          onClick={handleGoogleSignIn}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            border: `1.5px solid ${C.line}`,
            borderRadius: 14,
            padding: "13px 16px",
            background: "#fff",
            cursor: "pointer",
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 700,
            color: C.ink,
            boxShadow: "0 2px 8px -2px rgba(44,26,46,.12)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>

        <p
          style={{
            fontSize: 11.5,
            color: C.inkSoft,
            marginTop: 20,
            lineHeight: 1.6,
            fontFamily: FONT_SANS,
          }}
        >
          Tus itinerarios se guardan de forma segura y privada en la nube.
        </p>
      </div>
    </div>
  );
}
