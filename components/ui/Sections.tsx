import { C, FONT_DISPLAY } from "@/lib/theme";

export function Header({
  title,
  subtitle,
  noTop,
}: {
  title: string;
  subtitle?: string;
  noTop?: boolean;
}) {
  return (
    <div style={{ padding: noTop ? "16px 16px 12px" : "52px 16px 12px" }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 27, margin: 0 }}>{title}</h1>
      {subtitle && <div style={{ color: C.inkSoft, fontSize: 13.5, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "20px 16px 10px",
        fontSize: 12.5,
        fontWeight: 800,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: C.inkSoft,
      }}
    >
      {children}
    </div>
  );
}
