import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #E0654F 0%, #D98A3D 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 115,
        }}
      >
        <div style={{ fontSize: 280, lineHeight: 1 }}>✈️</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
