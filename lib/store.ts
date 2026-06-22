"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Trip, TripDay, ItineraryItem, City, Contact, NewTripInput, TransportMode, ItemType } from "./types";
import { uid, generateTripDays } from "./format";
import { getCountryConfig } from "./phrases";
import { getCountryEmergency, buildDefaultContacts } from "./countries";

// ─── Internal ────────────────────────────────────────────────────────────────

async function tryWikipediaThumbnail(name: string, lang = "en"): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return undefined;
    const data = await res.json() as { type?: string; thumbnail?: { source: string } };
    if (data.type === "disambiguation") return undefined;
    return data.thumbnail?.source;
  } catch {
    return undefined;
  }
}

async function fetchWikipediaImage(cityRaw: string, title?: string): Promise<string | undefined> {
  const city = cityRaw.split(",")[0].trim();
  // Cascade: city (en) → "city City" (en) → title (en) → city (es) → title (es)
  return (
    await tryWikipediaThumbnail(city) ??
    await tryWikipediaThumbnail(`${city} City`) ??
    (title && title !== city ? await tryWikipediaThumbnail(title) : undefined) ??
    await tryWikipediaThumbnail(city, "es") ??
    (title && title !== city ? await tryWikipediaThumbnail(title, "es") : undefined)
  );
}

async function fetchAllTrips(): Promise<{ trip: Trip; ownerId: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("trip_data, user_id")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({ trip: row.trip_data as Trip, ownerId: row.user_id as string }));
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createTrip(input: NewTripInput): Promise<Trip> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const countryName = input.country.trim() || "—";
  const { speakLang, phrases } = getCountryConfig(countryName);
  const { emergencyNumber, emergencyLabel } = getCountryEmergency(countryName);
  const contacts = buildDefaultContacts(countryName);

  const days = generateTripDays(input.startDate, input.endDate);
  const cities: City[] = [];

  if (input.transport && (input.originCity || input.destinationCity) && days.length > 0) {
    const TYPE_MAP: Record<TransportMode, ItemType> = {
      plane: "flight", car: "transfer", train: "train", ship: "ship", other: "transfer",
    };
    const LABEL_MAP: Record<TransportMode, string> = {
      plane: "Vuelo", car: "Coche", train: "Tren", ship: "Barco", other: "Traslado",
    };

    const itype = TYPE_MAP[input.transport];
    const label = LABEL_MAP[input.transport];
    const orig = (input.originCity ?? "").split(",")[0].trim();
    const dest = (input.destinationCity ?? "").split(",")[0].trim();

    const outTitle = orig && dest ? `${label} ${orig} → ${dest}` : `${label} de ida`;
    const retTitle = orig && dest ? `${label} ${dest} → ${orig}` : `${label} de vuelta`;

    if (days.length === 1) {
      days[0].city = orig && dest ? `${orig} → ${dest}` : dest || orig;
      days[0].items = [
        { id: uid(), type: itype, time: "—", title: outTitle, detail: orig ? `Salida desde ${orig}` : undefined },
        { id: uid(), type: itype, time: "—", title: retTitle, detail: dest ? `Regreso desde ${dest}` : undefined },
      ];
    } else {
      days[0].city = orig && dest ? `${orig} → ${dest}` : dest || orig;
      days[0].items = [{ id: uid(), type: itype, time: "—", title: outTitle, detail: orig ? `Salida desde ${orig}` : undefined }];

      for (let i = 1; i < days.length - 1; i++) {
        days[i].city = dest || orig;
      }

      const last = days.length - 1;
      days[last].city = orig && dest ? `${dest} → ${orig}` : orig || dest;
      days[last].items = [{ id: uid(), type: itype, time: "—", title: retTitle, detail: dest ? `Regreso desde ${dest}` : undefined }];
    }

    if (dest && input.destinationCity) {
      cities.push({ id: uid(), name: dest, highlights: [], mapsQuery: input.destinationCity });
    }
  }

  const searchQuery = input.destinationCity || input.title.trim();
  const coverImage = searchQuery
    ? await fetchWikipediaImage(searchQuery, input.title.trim())
    : input.coverImage;

  const trip: Trip = {
    id: uid(),
    title: input.title.trim() || "Nuevo viaje",
    tagline: input.tagline?.trim() || undefined,
    travelers: input.travelers?.trim() || undefined,
    country: countryName,
    startDate: input.startDate,
    endDate: input.endDate,
    theme: { from: "#3F6E8C", mid: "#7A4A6B", to: "#E0654F" },
    coverImage,
    emergencyNumber,
    emergencyLabel,
    speakLang,
    days,
    cities,
    contacts,
    phrases,
  };

  const { error } = await supabase.from("trips").insert({
    id: trip.id,
    user_id: user.id,
    trip_data: trip,
  });
  if (error) throw error;
  return trip;
}

export const updateTrip = async (
  id: string,
  updater: (t: Trip) => Trip
): Promise<void> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // No user_id filter — RLS handles access (owner + collaborators)
  const { data, error } = await supabase
    .from("trips")
    .select("trip_data")
    .eq("id", id)
    .single();
  if (error || !data) return;
  const updated = updater(data.trip_data as Trip);
  await supabase
    .from("trips")
    .update({ trip_data: updated, updated_at: new Date().toISOString() })
    .eq("id", id);
};

export const addDayToTrip = (tripId: string, day: TripDay): Promise<void> =>
  updateTrip(tripId, (t) => ({
    ...t,
    days: [...t.days, day].sort((a, b) => a.date.localeCompare(b.date)),
  }));

export const addItemToDay = (
  tripId: string,
  dayId: string,
  item: ItineraryItem
): Promise<void> =>
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

export const updateDayCity = (
  tripId: string,
  dayId: string,
  city: string
): Promise<void> =>
  updateTrip(tripId, (t) => ({
    ...t,
    days: t.days.map((d) => (d.id === dayId ? { ...d, city } : d)),
  }));

export const deleteItemFromDay = (
  tripId: string,
  dayId: string,
  itemId: string
): Promise<void> =>
  updateTrip(tripId, (t) => ({
    ...t,
    days: t.days.map((d) =>
      d.id === dayId
        ? { ...d, items: d.items.filter((it) => it.id !== itemId) }
        : d
    ),
    cities: t.cities.filter((c) => c.sourceItemId !== itemId),
  }));

export const addContact = (tripId: string, contact: Contact): Promise<void> =>
  updateTrip(tripId, (t) => ({ ...t, contacts: [...t.contacts, contact] }));

export const deleteContact = (tripId: string, contactId: string): Promise<void> =>
  updateTrip(tripId, (t) => ({
    ...t,
    contacts: t.contacts.filter((c) => c.id !== contactId),
  }));

export async function deleteTrip(id: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("trips").delete().eq("id", id).eq("user_id", user.id);
}

// ─── Sharing ─────────────────────────────────────────────────────────────────

const SHARE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeShareCode(): string {
  const rand = (n: number) => Math.floor(Math.random() * n);
  const part = () =>
    Array.from({ length: 4 }, () => SHARE_ALPHABET[rand(SHARE_ALPHABET.length)]).join("");
  return `${part()}-${part()}`;
}

export async function getOrCreateShareCode(tripId: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from("trips")
    .select("share_code")
    .eq("id", tripId)
    .single();
  if (data?.share_code) return data.share_code as string;
  const code = makeShareCode();
  await supabase.from("trips").update({ share_code: code }).eq("id", tripId);
  return code;
}

export async function joinTripByCode(rawCode: string): Promise<Trip> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const code = rawCode.trim().toUpperCase();
  const { data: tripRow, error } = await supabase
    .from("trips")
    .select("id, user_id, trip_data")
    .eq("share_code", code)
    .single();

  if (error || !tripRow) throw new Error("invalid_code");
  if (tripRow.user_id === user.id) throw new Error("already_owner");

  const { error: collabError } = await supabase
    .from("trip_collaborators")
    .upsert({ trip_id: tripRow.id, user_id: user.id }, { onConflict: "trip_id,user_id" });
  if (collabError) throw collabError;

  return tripRow.trip_data as Trip;
}

export async function leaveSharedTrip(tripId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("trip_collaborators")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", user.id);
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useTrips(): {
  trips: Trip[];
  collaboratorTripIds: Set<string>;
  ready: boolean;
  removeTrip: (id: string) => Promise<void>;
  leaveTrip: (id: string) => Promise<void>;
} {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [collaboratorTripIds, setCollaboratorTripIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const applyRows = useCallback((rows: { trip: Trip; ownerId: string }[]) => {
    const uid = userIdRef.current;
    setTrips(rows.map((r) => r.trip));
    setCollaboratorTripIds(new Set(rows.filter((r) => r.ownerId !== uid).map((r) => r.trip.id)));
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      if (!user) { setReady(true); return; }
      userIdRef.current = user.id;

      fetchAllTrips().then((data) => {
        if (mounted) { applyRows(data); setReady(true); }
      });

      const refetch = () =>
        fetchAllTrips().then((data) => { if (mounted) applyRows(data); });

      channel = supabase
        .channel("trips_realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trips", filter: `user_id=eq.${user.id}` },
          refetch
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trip_collaborators", filter: `user_id=eq.${user.id}` },
          refetch
        )
        .subscribe();
    });

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [applyRows]);

  const removeTrip = useCallback(async (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    await deleteTrip(id);
  }, []);

  const leaveTrip = useCallback(async (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setCollaboratorTripIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    await leaveSharedTrip(id);
  }, []);

  return { trips, collaboratorTripIds, ready, removeTrip, leaveTrip };
}

export function useTrip(id: string): { trip: Trip | undefined; ready: boolean } {
  const { trips, ready } = useTrips();
  return { trip: trips.find((t) => t.id === id), ready };
}

export function useUser(): {
  name: string;
  avatarUrl: string | null;
  email: string | null;
} {
  const [name, setName] = useState("Viajero");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setName(
        user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "Viajero"
      );
      setAvatarUrl(
        user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null
      );
      setEmail(user.email ?? null);
    });
  }, []);

  return { name, avatarUrl, email };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/login";
}

// ─── Locale ───────────────────────────────────────────────────────────────────

const LOCALE_CACHE_KEY = "itinera_locale";

export function useLocale(): {
  locale: string | null;
  setLocale: (l: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
} {
  const cached = typeof window !== "undefined" ? localStorage.getItem(LOCALE_CACHE_KEY) : null;
  const [locale, setLocaleState] = useState<string | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setIsAuthenticated(true);
      const { data } = await supabase
        .from("profiles")
        .select("locale")
        .eq("user_id", user.id)
        .maybeSingle();
      const l = data?.locale ?? null;
      if (l) localStorage.setItem(LOCALE_CACHE_KEY, l);
      setLocaleState(l);
      setLoading(false);
    });
  }, []);

  const setLocale = async (l: string) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_CACHE_KEY, l);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").upsert(
      { user_id: user.id, locale: l, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  };

  return { locale, setLocale, loading, isAuthenticated };
}
