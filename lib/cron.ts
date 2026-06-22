import { createServiceClient } from "./supabase/service";
import { initWebPush, sendPush, type WPSubscription } from "./push";
import {
  buildNotification,
  getDepartureHour,
  diffDays,
  getSpainDate,
  type NotificationType,
} from "./notifications";
import type { Trip } from "./types";

type TripRow = { user_id: string; trip_data: Trip };
type SubRow = { user_id: string; endpoint: string; subscription: WPSubscription };
type ProfileRow = { user_id: string; locale: string };

export type CronMode = "main" | "early";

/**
 * main  → 5am UTC (7am Spain): 7-day, 3-day, departure ≥8h, daily summaries
 * early → 3am UTC (5am Spain): departure <8h only (2h-before for early flights)
 */
export const runNotificationCron = async (mode: CronMode) => {
  initWebPush();
  const db = createServiceClient();
  const today = getSpainDate();
  const sent: string[] = [];
  const skipped: string[] = [];

  const { data: tripRows, error: tripErr } = await db
    .from("trips")
    .select("user_id, trip_data");

  if (tripErr || !tripRows?.length) {
    return { ok: true, sent, skipped, today };
  }

  const userIds = [...new Set((tripRows as TripRow[]).map((r) => r.user_id))];

  const { data: subRows } = await db
    .from("push_subscriptions")
    .select("user_id, endpoint, subscription")
    .in("user_id", userIds);

  const { data: profileRows } = await db
    .from("profiles")
    .select("user_id, locale")
    .in("user_id", userIds);

  const localeByUser: Record<string, string> = {};
  for (const p of (profileRows as ProfileRow[]) ?? []) {
    localeByUser[p.user_id] = p.locale;
  }

  const subsByUser: Record<string, SubRow[]> = {};
  for (const row of (subRows as SubRow[]) ?? []) {
    (subsByUser[row.user_id] ??= []).push(row);
  }

  for (const row of tripRows as TripRow[]) {
    const trip = row.trip_data;
    const subs = subsByUser[row.user_id] ?? [];
    if (!subs.length) continue;

    const diff = diffDays(trip.startDate, today);
    const isOngoing = today >= trip.startDate && today <= trip.endDate;
    const toSend: NotificationType[] = [];

    if (mode === "main") {
      if (diff === 7) toSend.push("7days");
      if (diff === 3) toSend.push("3days");
      if (diff === 0) {
        const depHour = getDepartureHour(trip);
        // main cron handles: no departure time OR departure at 8h or later
        if (depHour === null || depHour >= 8) toSend.push("departure");
      }
      // daily summary: ongoing trip, past departure day
      if (isOngoing && diff < 0) {
        toSend.push(`daily_${today}` as NotificationType);
      }
    } else {
      // early cron: only early departures (<8h Spain) so we hit ~2h before
      if (diff === 0) {
        const depHour = getDepartureHour(trip);
        if (depHour !== null && depHour < 8) toSend.push("departure");
      }
    }

    for (const type of toSend) {
      // Deduplication — one notification per (trip, type) ever
      const { data: existing } = await db
        .from("notification_logs")
        .select("id")
        .eq("trip_id", trip.id)
        .eq("notification_type", type)
        .maybeSingle();

      if (existing) {
        skipped.push(`${trip.id}:${type}`);
        continue;
      }

      const locale = localeByUser[row.user_id] ?? "es";
      const payload = buildNotification(trip, type, locale);
      let sentCount = 0;

      for (const sub of subs) {
        const result = await sendPush(sub.subscription, payload);
        if (result === "sent") sentCount++;
        if (result === "expired") {
          // Clean up stale subscription
          await db
            .from("push_subscriptions")
            .delete()
            .eq("user_id", row.user_id)
            .eq("endpoint", sub.endpoint);
        }
      }

      // Always log to prevent retry spam, even if all pushes errored
      await db.from("notification_logs").insert({
        trip_id: trip.id,
        notification_type: type,
      });

      if (sentCount > 0) sent.push(`${trip.id}:${type}`);
    }
  }

  return { ok: true, sent, skipped, today };
};
