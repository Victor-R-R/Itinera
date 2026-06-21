"use client";

import { useSyncExternalStore } from "react";
import type { Trip, TripDay, ItineraryItem, City, NewTripInput } from "./types";
import { SAMPLE_TRIPS } from "./data/sample-trips";
import { uid, generateTripDays } from "./format";
import { getCountryConfig } from "./phrases";

/**
 * Trip store.
 *
 * Today this is a tiny localStorage-backed store so the app runs with zero
 * backend. It is the ONE place to change when wiring a real database.
 *
 *   → To move to Supabase / Prisma (your usual stack):
 *     1. Turn `getTrips` / `getTrip` into server functions reading from the DB.
 *     2. Replace the read/write hooks below with server actions + revalidate.
 *     3. Render trip/[id] as a Server Component fetching by id.
 *   The component tree (tabs, PhoneFrame…) only consumes `Trip`, so nothing
 *   above this file needs to change.
 */

const KEY = "itinera.trips.v1";
const EVENT = "itinera:trips-changed";

let snapshot: Trip[] | null = null;

function read(): Trip[] {
  if (snapshot !== null) return snapshot;
  if (typeof window === "undefined") return SAMPLE_TRIPS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SAMPLE_TRIPS));
      snapshot = SAMPLE_TRIPS;
    } else {
      snapshot = JSON.parse(raw) as Trip[];
    }
  } catch {
    snapshot = SAMPLE_TRIPS;
  }
  return snapshot;
}

function write(trips: Trip[]) {
  if (typeof window === "undefined") return;
  snapshot = trips;
  window.localStorage.setItem(KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event(EVENT));
}

export function createTrip(input: NewTripInput): Trip {
  const countryName = input.country.trim() || "—";
  const { speakLang, phrases } = getCountryConfig(countryName);
  const trip: Trip = {
    id: uid(),
    title: input.title.trim() || "Nuevo viaje",
    tagline: input.tagline?.trim() || undefined,
    travelers: input.travelers?.trim() || undefined,
    country: countryName,
    startDate: input.startDate,
    endDate: input.endDate,
    theme: { from: "#3F6E8C", mid: "#7A4A6B", to: "#E0654F" },
    emergencyNumber: "112",
    emergencyLabel: "Emergencias",
    speakLang,
    days: generateTripDays(input.startDate, input.endDate),
    cities: [],
    contacts: [],
    phrases,
  };
  write([...read(), trip]);
  return trip;
}

export const updateTrip = (id: string, updater: (t: Trip) => Trip) => {
  write(read().map((t) => (t.id === id ? updater(t) : t)));
};

export const addDayToTrip = (tripId: string, day: TripDay) => {
  updateTrip(tripId, (t) => ({
    ...t,
    days: [...t.days, day].sort((a, b) => a.date.localeCompare(b.date)),
  }));
};

export const addItemToDay = (tripId: string, dayId: string, item: ItineraryItem) => {
  updateTrip(tripId, (t) => {
    const days = t.days.map((d) =>
      d.id === dayId ? { ...d, items: [...d.items, item] } : d
    );
    if (!item.location) return { ...t, days };
    const city: City = {
      id: uid(),
      name: item.title,
      highlights: [],
      mapsQuery: item.location,
      sourceItemId: item.id,
    };
    return { ...t, days, cities: [...t.cities, city] };
  });
};

export const updateDayCity = (tripId: string, dayId: string, city: string) => {
  updateTrip(tripId, (t) => ({
    ...t,
    days: t.days.map((d) => d.id === dayId ? { ...d, city } : d),
  }));
};

export const deleteItemFromDay = (tripId: string, dayId: string, itemId: string) => {
  updateTrip(tripId, (t) => ({
    ...t,
    days: t.days.map((d) =>
      d.id === dayId ? { ...d, items: d.items.filter((it) => it.id !== itemId) } : d
    ),
    cities: t.cities.filter((c) => c.sourceItemId !== itemId),
  }));
};

export function deleteTrip(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function resetTrips() {
  write(SAMPLE_TRIPS);
}

const subscribe = (cb: () => void) => {
  const onEvent = () => cb();
  const onStorage = () => { snapshot = null; cb(); };
  window.addEventListener(EVENT, onEvent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
  };
};

/** Subscribe to all trips. */
export function useTrips(): { trips: Trip[]; ready: boolean } {
  const trips = useSyncExternalStore(subscribe, read, () => SAMPLE_TRIPS);
  return { trips, ready: true };
}

/** Subscribe to a single trip by id. */
export function useTrip(id: string): { trip: Trip | undefined; ready: boolean } {
  const { trips, ready } = useTrips();
  return { trip: trips.find((t) => t.id === id), ready };
}
