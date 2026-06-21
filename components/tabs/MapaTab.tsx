"use client";

import { BedDouble, MapPin, ExternalLink } from "lucide-react";
import { C, FONT_DISPLAY, FONT_SANS } from "@/lib/theme";
import { mapsUrl } from "@/lib/format";
import { metaFor } from "@/lib/itinerary";
import { Header } from "@/components/ui/Sections";
import type { Trip, City } from "@/lib/types";

export default function MapaTab({ trip }: { trip: Trip }) {
  const manual = trip.cities.filter((c) => !c.sourceItemId);
  const auto = trip.cities.filter((c) => !!c.sourceItemId);

  const allCities = [...manual, ...auto];

  return (
    <div>
      <Header
        title="La ruta"
        subtitle={`${allCities.length} ${allCities.length === 1 ? "lugar" : "lugares"}`}
      />

      {allCities.length === 0 ? (
        <div style={{ padding: "0 16px", color: C.inkSoft, fontSize: 13.5, lineHeight: 1.6 }}>
          Los lugares aparecerán aquí automáticamente al añadir vuelos, hoteles y actividades con ubicación.
        </div>
      ) : (
        <div style={{ padding: "4px 16px 8px" }}>
          {allCities.map((c, i) => (
            <CityCard key={c.id} city={c} index={i} last={i === allCities.length - 1} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

function CityCard({ city, index, last, trip }: { city: City; index: number; last: boolean; trip: Trip }) {
  const sourceItem = city.sourceItemId
    ? trip.days.flatMap((d) => d.items).find((it) => it.id === city.sourceItemId)
    : undefined;
  const meta = sourceItem ? metaFor(sourceItem.type) : null;

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 26, flexShrink: 0 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: meta ? meta.bg : C.rose,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
            color: meta ? meta.color : "#fff",
          }}
        >
          {meta ? <meta.Icon size={13} /> : index + 1}
        </div>
        {!last && <div style={{ flex: 1, width: 2, background: C.line, margin: "4px 0", borderRadius: 2 }} />}
      </div>

      <div style={{ flex: 1, paddingBottom: 18, minWidth: 0 }}>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              {meta && (
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 9.5,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: meta.color,
                    background: meta.bg,
                    padding: "2px 7px",
                    borderRadius: 999,
                    marginBottom: 6,
                  }}
                >
                  {meta.label}
                </span>
              )}
              <h3
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: 17,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {city.name}
              </h3>
            </div>
            {city.stay && (
              <span style={{ fontSize: 11.5, color: C.inkSoft, fontWeight: 600, flexShrink: 0 }}>{city.stay}</span>
            )}
          </div>

          {city.hotel && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "10px 0", fontSize: 13 }}>
              <BedDouble size={15} color={C.plum} />
              <span style={{ fontWeight: 600 }}>{city.hotel}</span>
            </div>
          )}

          {city.highlights.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {city.highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: C.amber,
                    background: "#FBF0E0",
                    padding: "4px 9px",
                    borderRadius: 999,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <a
            href={mapsUrl(city.mapsQuery)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              color: C.dusk,
              textDecoration: "none",
              background: "#EAF1F6",
              padding: "8px 12px",
              borderRadius: 12,
            }}
          >
            <MapPin size={14} /> Abrir en Google Maps <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
