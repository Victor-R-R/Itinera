/**
 * Domain model for the itinerary manager.
 * Everything is trip-agnostic: a Trip can be a honeymoon, a business trip,
 * a weekend away — the same shape works for all of them.
 */

export type ItemType = "flight" | "hotel" | "activity" | "transfer" | "free" | "train" | "ship";

export type TransportMode = "plane" | "car" | "train" | "ship" | "other";

export interface ItineraryItem {
  id: string;
  type: ItemType;
  /** Free-form time label: "10:40", "Libre", "Mañana"… */
  time: string;
  title: string;
  detail?: string;
  /** Secondary note, rendered in italics (tips, duration…). */
  note?: string;
  /** Google Maps search query — if set, a City entry is auto-created in /mapa. */
  location?: string;
}

export interface TripDay {
  id: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  /** Where the traveller is that day, e.g. "Nueva York" or "Madrid → Nueva York". */
  city: string;
  items: ItineraryItem[];
}

export interface City {
  id: string;
  name: string;
  /** Human label for the stay, e.g. "4–6 jul · 2 noches". */
  stay?: string;
  hotel?: string;
  highlights: string[];
  /** Query passed to Google Maps. */
  mapsQuery: string;
  /** If set, this city was auto-created from an ItineraryItem and is managed automatically. */
  sourceItemId?: string;
}

export type ContactKind =
  | "emergency"
  | "insurance"
  | "email"
  | "consulate"
  | "card"
  | "other";

export interface Contact {
  id: string;
  kind: ContactKind;
  label: string;
  /** Phone number, email or any value. */
  value: string;
  note?: string;
}

export interface Phrase {
  id: string;
  category: string;
  /** What the traveller wants to say (their language). */
  source: string;
  /** The translation (destination language). */
  target: string;
}

export interface TripTheme {
  /** Hero gradient stops. */
  from: string;
  mid: string;
  to: string;
}

export interface Trip {
  id: string;
  title: string;
  /** Optional tagline shown above the title, e.g. "Luna de miel". */
  tagline?: string;
  travelers?: string;
  country: string;
  /** ISO dates. */
  startDate: string;
  endDate: string;
  theme: TripTheme;
  /** Representative photo URL for the destination (from Wikipedia). */
  coverImage?: string;
  /** Primary local emergency number (911, 112…). */
  emergencyNumber: string;
  emergencyLabel: string;
  /** BCP-47 tag used by the text-to-speech in the phrases tab. */
  speakLang: string;
  days: TripDay[];
  cities: City[];
  contacts: Contact[];
  phrases: Phrase[];
}

/** Minimal payload to spin up a new trip from the UI. */
export interface NewTripInput {
  title: string;
  tagline?: string;
  travelers?: string;
  country: string;
  startDate: string;
  endDate: string;
  transport?: TransportMode;
  originCity?: string;
  destinationCity?: string;
  coverImage?: string;
}
