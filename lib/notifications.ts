import type { Trip } from "./types";

export type NotificationType =
  | "7days"
  | "3days"
  | "departure"
  | `daily_${string}`;

export type NotificationPayload = {
  title: string;
  body: string;
  icon: string;
  url: string;
};

export const buildNotification = (
  trip: Trip,
  type: NotificationType,
  locale = "es"
): NotificationPayload => {
  const dest = trip.country || trip.title;
  const icon = "/icon.png";
  const fr = locale === "fr";

  if (type === "7days") {
    return {
      title: fr
        ? `✈️ Plus que 7 jours avant ${trip.title} !`
        : `✈️ ¡Faltan 7 días para ${trip.title}!`,
      body: fr
        ? `Votre aventure à ${dest} approche 🌍 Profitez-en pour compléter votre itinéraire et noter les détails importants ✍️`
        : `Tu aventura en ${dest} está a la vuelta de la esquina 🌍 Aprovecha para completar tu itinerario y añadir los detalles que no quieres olvidar ✍️`,
      icon,
      url: "/",
    };
  }

  if (type === "3days") {
    return {
      title: fr
        ? `🎒 Plus que 3 jours avant ${trip.title} !`
        : `🎒 ¡Solo 3 días para ${trip.title}!`,
      body: fr
        ? `L'heure du départ approche 🌟 Vérifiez les réservations, confirmez les hôtels et préparez la valise ! 🧳`
        : `Ya casi es hora de partir 🌟 Revisa las reservas, confirma los hoteles y ¡prepara esa maleta! 🧳`,
      icon,
      url: "/",
    };
  }

  if (type === "departure") {
    const depTime = getDepartureTime(trip);
    if (depTime) {
      return {
        title: fr ? `✨ C'est le grand jour ! ✨` : `✨ ¡Hoy es el gran día! ✨`,
        body: fr
          ? `Votre voyage vers ${dest} part à ${depTime} 🛫 Passeport, bonne humeur et envie d'aventure ! 😄`
          : `Tu viaje a ${dest} sale a las ${depTime} 🛫 ¡Lleva el pasaporte, el buen humor y muchas ganas de aventura! 😄`,
        icon,
        url: `/trip/${trip.id}`,
      };
    }
    return {
      title: fr
        ? `✨ ${trip.title} commence aujourd'hui ! ✨`
        : `✨ ¡Hoy comienza ${trip.title}! ✨`,
      body: fr
        ? `C'est le moment tant attendu 🌟 Que l'aventure à ${dest} soit absolument incroyable ! 🗺️`
        : `Este es el momento que tanto esperabas 🌟 ¡Que la aventura en ${dest} sea absolutamente increíble! 🗺️`,
      icon,
      url: `/trip/${trip.id}`,
    };
  }

  // daily_YYYY-MM-DD
  const date = (type as string).replace("daily_", "");
  const day = trip.days.find((d) => d.date === date);
  const city = day?.city || dest;

  if (!day || day.items.length === 0) {
    return {
      title: fr ? `🌅 Bonjour depuis ${city} !` : `🌅 ¡Buenos días en ${city}!`,
      body: fr
        ? `Une journée libre pour explorer ${city} à votre rythme 🌿 Chaque coin cache quelque chose de spécial !`
        : `Un día libre para explorar ${city} a tu ritmo 🌿 ¡Cada rincón guarda algo especial para ti!`,
      icon,
      url: `/trip/${trip.id}`,
    };
  }

  const topItems = day.items.slice(0, 3).map((i) => i.title);
  const summary = topItems.join(" · ");
  const extra = day.items.length > 3
    ? (fr ? ` et ${day.items.length - 3} de plus` : ` y ${day.items.length - 3} más`)
    : "";

  return {
    title: fr ? `🌅 Bonjour depuis ${city} !` : `🌅 ¡Buenos días en ${city}!`,
    body: fr
      ? `Au programme aujourd'hui : ${summary}${extra} 🌟 Passez une journée incroyable !`
      : `Hoy te espera: ${summary}${extra} 🌟 ¡Que sea un día increíble!`,
    icon,
    url: `/trip/${trip.id}`,
  };
};

export const getDepartureTime = (trip: Trip): string | null => {
  const firstDay = trip.days.find((d) => d.date === trip.startDate);
  if (!firstDay) return null;
  const item = firstDay.items.find((i) =>
    ["flight", "train", "ship"].includes(i.type)
  );
  if (!item) return null;
  const match = item.time.match(/^(\d{1,2}):(\d{2})$/);
  return match ? item.time : null;
};

export const getDepartureHour = (trip: Trip): number | null => {
  const t = getDepartureTime(trip);
  return t !== null ? parseInt(t.split(":")[0]) : null;
};

/** Positive = target is in the future. Negative = target is in the past. */
export const diffDays = (target: string, today: string): number => {
  const a = new Date(target + "T00:00:00").getTime();
  const b = new Date(today + "T00:00:00").getTime();
  return Math.round((a - b) / 86_400_000);
};

export const getSpainDate = (): string =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" });

export const getSpainHour = (): number => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
};
