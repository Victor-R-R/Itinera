"use client";

import { createContext, useContext, type ReactNode } from "react";
import es from "../messages/es.json";
import fr from "../messages/fr.json";
import { useLocale } from "./store";
import LocalePickerModal from "@/components/LocalePickerModal";

export type Locale = "es" | "fr";

const MESSAGES = { es, fr };
const DATE_LOCALE: Record<Locale, string> = { es: "es-ES", fr: "fr-FR" };

function get(obj: unknown, path: string): string {
  const keys = path.split(".");
  let cur: unknown = obj;
  for (const k of keys) {
    if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      return "";
    }
  }
  return typeof cur === "string" ? cur : "";
}

export type TFn = (key: string, params?: Record<string, string | number>) => string;

interface I18nCtx {
  t: TFn;
  locale: Locale;
  dateLocale: string;
  setLocale: (l: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nCtx>({
  t: (k) => k,
  locale: "es",
  dateLocale: "es-ES",
  setLocale: async () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale: storedLocale, setLocale, loading, isAuthenticated } = useLocale();

  const locale = ((storedLocale ?? "es") as Locale);
  const showPicker = !loading && storedLocale === null && isAuthenticated;

  const t: TFn = (key, params) => {
    let str = get(MESSAGES[locale], key) || get(MESSAGES.es, key) || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ t, locale, dateLocale: DATE_LOCALE[locale], setLocale }}>
      {showPicker && <LocalePickerModal onPick={setLocale} />}
      {children}
    </I18nContext.Provider>
  );
}

export const useT = () => useContext(I18nContext);
