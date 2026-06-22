import { uid } from "./format";
import type { Contact } from "./types";

type ConsulateInfo = Omit<Contact, "id">;

type CountryData = {
  emergencyNumber: string;
  emergencyLabel: string;
  // keyed by locale ("es", "fr") — each locale's own embassy/consulate at the destination
  consulates?: Partial<Record<string, ConsulateInfo>>;
};

type CountryEntry = {
  keys: string[];
  data: CountryData;
};

const COUNTRY_DATA: CountryEntry[] = [
  {
    keys: ["españa", "spain", "espana", "madrid", "barcelona", "sevilla", "valencia", "bilbao"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Madrid",
          value: "+34917008900",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["eeuu", "estados unidos", "usa", "united states", "america"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias EEUU",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Washington",
          value: "+12024520100",
          note: "Lun–Vie 9:00–14:30",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Washington",
          value: "+12029446000",
          note: "Lun–Ven 8:30–12:30",
        },
      },
    },
  },
  {
    keys: ["reino unido", "uk", "gran bretaña", "gran bretana", "inglaterra", "escocia", "gales"],
    data: {
      emergencyNumber: "999",
      emergencyLabel: "Emergencias Reino Unido",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Londres",
          value: "+442072355555",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Londres",
          value: "+442070731000",
          note: "Lun–Ven 9:00–13:00",
        },
      },
    },
  },
  {
    keys: ["australia"],
    data: {
      emergencyNumber: "000",
      emergencyLabel: "Emergencias Australia",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Camberra",
          value: "+61262733555",
          note: "Lun–Vie 9:00–13:30",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Canberra",
          value: "+61262160100",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["canadá", "canada"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias Canadá",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Ottawa",
          value: "+16137472252",
          note: "Lun–Vie 9:00–13:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Ottawa",
          value: "+16137891795",
          note: "Lun–Ven 8:30–12:30",
        },
      },
    },
  },
  {
    keys: ["nueva zelanda"],
    data: {
      emergencyNumber: "111",
      emergencyLabel: "Emergencias Nueva Zelanda",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Wellington",
          value: "+6444153952",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Wellington",
          value: "+6443842555",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["francia", "france"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en París",
          value: "+33144431800",
          note: "Lun–Vie 9:00–14:00",
        },
      },
    },
  },
  {
    keys: ["alemania", "germany", "deutschland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Berlín",
          value: "+492302540070",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Berlin",
          value: "+4930590039000",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["italia", "italy"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Roma",
          value: "+390668404001",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Rome",
          value: "+39066860111",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["portugal"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Lisboa",
          value: "+351213472381",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Lisbonne",
          value: "+351213939100",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["grecia", "greece"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Atenas",
          value: "+302103456041",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Athènes",
          value: "+302103391000",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["países bajos", "paises bajos", "holanda", "netherlands"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en La Haya",
          value: "+31703643814",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à La Haye",
          value: "+31703125800",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["bélgica", "belgica", "belgium"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Bruselas",
          value: "+3225093800",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Bruxelles",
          value: "+3225488711",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["austria"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Viena",
          value: "+43150679880",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Vienne",
          value: "+43150275100",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["suiza", "switzerland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Berna",
          value: "+41313508282",
          note: "Lun–Vie 9:00–13:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Berne",
          value: "+41313592111",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["japón", "japon", "japan"],
    data: {
      emergencyNumber: "119",
      emergencyLabel: "Ambulancia / Bomberos Japón",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Tokio",
          value: "+81335838531",
          note: "Policía: 110",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Tokyo",
          value: "+81357986000",
          note: "Police: 110",
        },
      },
    },
  },
  {
    keys: ["china"],
    data: {
      emergencyNumber: "120",
      emergencyLabel: "Ambulancia China",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Pekín",
          value: "+861065323629",
          note: "Policía: 110  |  Bomberos: 119",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Pékin",
          value: "+861085328080",
          note: "Police: 110  |  Pompiers: 119",
        },
      },
    },
  },
  {
    keys: ["corea", "korea"],
    data: {
      emergencyNumber: "119",
      emergencyLabel: "Ambulancia / Bomberos Corea",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Seúl",
          value: "+8227943581",
          note: "Policía: 112",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Séoul",
          value: "+8221494300",
          note: "Police: 112",
        },
      },
    },
  },
  {
    keys: ["tailandia", "thailand"],
    data: {
      emergencyNumber: "1669",
      emergencyLabel: "Ambulancia Tailandia",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Bangkok",
          value: "+6626618284",
          note: "Policía turista: 1155",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Bangkok",
          value: "+6626575100",
          note: "Police touriste: 1155",
        },
      },
    },
  },
  {
    keys: ["marruecos", "morocco"],
    data: {
      emergencyNumber: "15",
      emergencyLabel: "Ambulancia Marruecos",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Rabat",
          value: "+212537633900",
          note: "Policía: 19  |  Bomberos: 15",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Rabat",
          value: "+212537689700",
          note: "Police: 19  |  Pompiers: 15",
        },
      },
    },
  },
  {
    keys: ["egipto", "egypt"],
    data: {
      emergencyNumber: "123",
      emergencyLabel: "Ambulancia Egipto",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en El Cairo",
          value: "+20223636625",
          note: "Policía: 122",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France au Caire",
          value: "+20235673200",
          note: "Police: 122",
        },
      },
    },
  },
  {
    keys: ["emiratos", "dubai", "abu dhabi", "uae"],
    data: {
      emergencyNumber: "999",
      emergencyLabel: "Emergencias Emiratos",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Abu Dabi",
          value: "+97124269644",
          note: "Ambulancia: 998",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Abou Dhabi",
          value: "+97124435100",
          note: "Ambulance: 998",
        },
      },
    },
  },
  {
    keys: ["turquía", "turquia", "turkey"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias Turquía",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Ankara",
          value: "+903124380392",
          note: "Lun–Vie 9:00–13:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Ankara",
          value: "+903124554545",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
  {
    keys: ["méxico", "mexico"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias México",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Ciudad de México",
          value: "+5255528229744",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Mexico",
          value: "+525591719700",
          note: "Lun–Ven 9:00–13:00",
        },
      },
    },
  },
  {
    keys: ["argentina"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias Argentina",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Buenos Aires",
          value: "+541148190031",
          note: "Ambulancia: 107",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Buenos Aires",
          value: "+541145157030",
          note: "Ambulance: 107",
        },
      },
    },
  },
  {
    keys: ["brasil", "brazil"],
    data: {
      emergencyNumber: "192",
      emergencyLabel: "Ambulancia Brasil",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Brasilia",
          value: "+556132424848",
          note: "Policía: 190  |  Bomberos: 193",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Brasilia",
          value: "+556132221300",
          note: "Police: 190  |  Pompiers: 193",
        },
      },
    },
  },
  {
    keys: ["colombia"],
    data: {
      emergencyNumber: "123",
      emergencyLabel: "Emergencias Colombia",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Bogotá",
          value: "+5716574090",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Bogotá",
          value: "+5716381400",
          note: "Lun–Ven 9:00–13:00",
        },
      },
    },
  },
  {
    keys: ["perú", "peru"],
    data: {
      emergencyNumber: "117",
      emergencyLabel: "Ambulancia Perú",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Lima",
          value: "+5112127295",
          note: "Policía: 105",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Lima",
          value: "+5112158400",
          note: "Police: 105",
        },
      },
    },
  },
  {
    keys: ["india"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias India",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Nueva Delhi",
          value: "+911123792085",
          note: "Ambulancia: 102  |  Policía: 100",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à New Delhi",
          value: "+911124196100",
          note: "Ambulance: 102  |  Police: 100",
        },
      },
    },
  },
  {
    keys: ["irlanda", "ireland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias Irlanda",
      consulates: {
        es: {
          kind: "consulate",
          label: "Embajada de España en Dublín",
          value: "+35312691640",
          note: "Lun–Vie 9:00–14:00",
        },
        fr: {
          kind: "consulate",
          label: "Ambassade de France à Dublin",
          value: "+35312775000",
          note: "Lun–Ven 9:00–12:30",
        },
      },
    },
  },
];

const DEFAULT: CountryData = {
  emergencyNumber: "112",
  emergencyLabel: "Número de emergencias",
};

const findEntry = (country: string): CountryEntry | undefined => {
  const normalized = country.toLowerCase().trim();
  return COUNTRY_DATA.find((entry) =>
    entry.keys.some((key) => normalized.includes(key))
  );
};

export const getCountryEmergency = (country: string): CountryData => {
  return findEntry(country)?.data ?? DEFAULT;
};

export const getConsulateForLocale = (
  country: string,
  locale: string
): ConsulateInfo | undefined => {
  const consulates = findEntry(country)?.data.consulates;
  if (!consulates) return undefined;
  return consulates[locale] ?? consulates.es ?? undefined;
};

export const buildDefaultContacts = (country: string, locale = "es"): Contact[] => {
  const consulate = getConsulateForLocale(country, locale);
  if (!consulate) return [];
  return [{ id: uid(), ...consulate }];
};

// ─── Traducciones display-time ────────────────────────────────────────────────
// Los datos se almacenan en español en Supabase (lengua base).
// Estos mapas permiten traducir al locale del usuario sin migrar datos.

export const EMERGENCY_LABEL_I18N: Record<string, Partial<Record<"fr", string>>> = {
  "Emergencias EEUU":                 { fr: "Urgences USA" },
  "Emergencias Reino Unido":          { fr: "Urgences Royaume-Uni" },
  "Emergencias Australia":            { fr: "Urgences Australie" },
  "Emergencias Canadá":               { fr: "Urgences Canada" },
  "Emergencias Nueva Zelanda":        { fr: "Urgences Nouvelle-Zélande" },
  "Número europeo de emergencias":    { fr: "Numéro européen d'urgence" },
  "Ambulancia / Bomberos Japón":      { fr: "Ambulance / Pompiers Japon" },
  "Ambulancia China":                 { fr: "Ambulance Chine" },
  "Ambulancia / Bomberos Corea":      { fr: "Ambulance / Pompiers Corée" },
  "Ambulancia Tailandia":             { fr: "Ambulance Thaïlande" },
  "Ambulancia Marruecos":             { fr: "Ambulance Maroc" },
  "Ambulancia Egipto":                { fr: "Ambulance Égypte" },
  "Emergencias Emiratos":             { fr: "Urgences Émirats" },
  "Emergencias Turquía":              { fr: "Urgences Turquie" },
  "Emergencias México":               { fr: "Urgences Mexique" },
  "Emergencias Argentina":            { fr: "Urgences Argentine" },
  "Ambulancia Brasil":                { fr: "Ambulance Brésil" },
  "Emergencias Colombia":             { fr: "Urgences Colombie" },
  "Ambulancia Perú":                  { fr: "Ambulance Pérou" },
  "Emergencias India":                { fr: "Urgences Inde" },
  "Emergencias Irlanda":              { fr: "Urgences Irlande" },
  "Número de emergencias":            { fr: "Numéro d'urgence" },
};

export const CONTACT_LABEL_I18N: Record<string, Partial<Record<"fr", string>>> = {
  "Embajada de España en Washington":    { fr: "Ambassade d'Espagne à Washington" },
  "Embajada de España en Londres":       { fr: "Ambassade d'Espagne à Londres" },
  "Embajada de España en Camberra":      { fr: "Ambassade d'Espagne à Canberra" },
  "Embajada de España en Ottawa":        { fr: "Ambassade d'Espagne à Ottawa" },
  "Embajada de España en Wellington":    { fr: "Ambassade d'Espagne à Wellington" },
  "Embajada de España en París":         { fr: "Ambassade d'Espagne à Paris" },
  "Embajada de España en Berlín":        { fr: "Ambassade d'Espagne à Berlin" },
  "Embajada de España en Roma":          { fr: "Ambassade d'Espagne à Rome" },
  "Embajada de España en Lisboa":        { fr: "Ambassade d'Espagne à Lisbonne" },
  "Embajada de España en Atenas":        { fr: "Ambassade d'Espagne à Athènes" },
  "Embajada de España en La Haya":       { fr: "Ambassade d'Espagne à La Haye" },
  "Embajada de España en Bruselas":      { fr: "Ambassade d'Espagne à Bruxelles" },
  "Embajada de España en Viena":         { fr: "Ambassade d'Espagne à Vienne" },
  "Embajada de España en Berna":         { fr: "Ambassade d'Espagne à Berne" },
  "Embajada de España en Tokio":         { fr: "Ambassade d'Espagne à Tokyo" },
  "Embajada de España en Pekín":         { fr: "Ambassade d'Espagne à Pékin" },
  "Embajada de España en Seúl":          { fr: "Ambassade d'Espagne à Séoul" },
  "Embajada de España en Bangkok":       { fr: "Ambassade d'Espagne à Bangkok" },
  "Embajada de España en Rabat":         { fr: "Ambassade d'Espagne à Rabat" },
  "Embajada de España en El Cairo":      { fr: "Ambassade d'Espagne au Caire" },
  "Embajada de España en Abu Dabi":      { fr: "Ambassade d'Espagne à Abou Dhabi" },
  "Embajada de España en Ankara":        { fr: "Ambassade d'Espagne à Ankara" },
  "Embajada de España en Ciudad de México": { fr: "Ambassade d'Espagne à Mexico" },
  "Embajada de España en Buenos Aires":  { fr: "Ambassade d'Espagne à Buenos Aires" },
  "Embajada de España en Brasilia":      { fr: "Ambassade d'Espagne à Brasilia" },
  "Embajada de España en Bogotá":        { fr: "Ambassade d'Espagne à Bogotá" },
  "Embajada de España en Lima":          { fr: "Ambassade d'Espagne à Lima" },
  "Embajada de España en Nueva Delhi":   { fr: "Ambassade d'Espagne à New Delhi" },
  "Embajada de España en Dublín":        { fr: "Ambassade d'Espagne à Dublin" },
};
