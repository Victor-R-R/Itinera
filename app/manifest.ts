import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Itinera · Gestor de itinerarios",
    short_name: "Itinera",
    description:
      "Organiza el día a día de cada viaje: vuelos, hoteles, visitas, frases y ayuda.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF4EE",
    theme_color: "#E7DCD6",
    orientation: "portrait",
    categories: ["travel", "lifestyle"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
