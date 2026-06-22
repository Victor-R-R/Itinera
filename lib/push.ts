import webpush from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  icon?: string;
  url?: string;
};

export type WPSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

let initialized = false;

export const initWebPush = () => {
  if (initialized) return;
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  initialized = true;
};

export const sendPush = async (
  subscription: WPSubscription,
  payload: PushPayload
): Promise<"sent" | "expired" | "error"> => {
  try {
    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    );
    return "sent";
  } catch (err) {
    const code = (err as { statusCode?: number }).statusCode;
    if (code === 410 || code === 404) return "expired";
    console.error("[push] send error:", err);
    return "error";
  }
};
