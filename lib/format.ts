import type { Trip, TripDay } from "./types";

const asDate = (iso: string) => new Date(iso + "T00:00:00");

export function fmt(iso: string, opts: Intl.DateTimeFormatOptions, locale = "es-ES") {
  return new Intl.DateTimeFormat(locale, opts).format(asDate(iso));
}

export const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const MS_PER_DAY = 86_400_000;

export function daysBetween(fromIso: string, toIso: string) {
  return Math.ceil((asDate(toIso).getTime() - asDate(fromIso).getTime()) / MS_PER_DAY);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Index of "today" within the trip days, or -1 if outside the trip. */
export function todayIndex(trip: Trip) {
  const t = todayIso();
  return trip.days.findIndex((d) => d.date === t);
}

export interface TripStatus {
  big: string;
  small: string;
}

export function tripStatus(trip: Trip): TripStatus {
  const idx = todayIndex(trip);
  if (idx >= 0) return { big: `Día ${idx + 1}`, small: "Estáis de viaje ahora mismo" };
  const until = daysBetween(todayIso(), trip.startDate);
  if (until > 0)
    return { big: `Faltan ${until}`, small: until === 1 ? "día para el viaje" : "días para el viaje" };
  return { big: "Finalizado", small: "El viaje ha terminado" };
}

export function mapsUrl(query: string) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}

/** Text-to-speech for the phrases tab. Silently no-ops if unsupported. */
export function speak(text: string, lang = "en-US") {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* speech synthesis unavailable */
  }
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/** Generate one TripDay per calendar day in [startDate, endDate] (ISO yyyy-mm-dd). */
export const generateTripDays = (startDate: string, endDate: string): TripDay[] => {
  const days: TripDay[] = [];
  const cur = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  while (cur <= end) {
    days.push({ id: uid(), date: cur.toISOString().slice(0, 10), city: "", items: [] });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
};
