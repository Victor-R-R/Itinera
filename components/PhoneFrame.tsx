import type { ReactNode } from "react";
import { C } from "@/lib/theme";

/** Centers the app inside a phone-sized frame on any screen. */
export default function PhoneFrame({
  children,
  bg = `linear-gradient(180deg, ${C.cream} 0%, #F6E7DF 100%)`,
}: {
  children: ReactNode;
  bg?: string;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.pageBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 412,
          height: "min(858px, 94dvh)",
          background: bg,
          borderRadius: 36,
          boxShadow: "0 30px 70px -20px rgba(44,26,46,.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}
