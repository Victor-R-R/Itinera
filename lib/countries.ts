import { uid } from "./format";
import type { Contact } from "./types";

type CountryData = {
  emergencyNumber: string;
  emergencyLabel: string;
  consulate?: Omit<Contact, "id">;
};

type CountryEntry = {
  keys: string[];
  data: CountryData;
};

const COUNTRY_DATA: CountryEntry[] = [
  {
    keys: ["eeuu", "estados unidos", "usa", "united states", "america"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias EEUU",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Washington",
        value: "+12024520100",
        note: "Lun–Vie 9:00–14:30",
      },
    },
  },
  {
    keys: ["reino unido", "uk", "gran bretaña", "gran bretana", "inglaterra", "escocia", "gales"],
    data: {
      emergencyNumber: "999",
      emergencyLabel: "Emergencias Reino Unido",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Londres",
        value: "+442072355555",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["australia"],
    data: {
      emergencyNumber: "000",
      emergencyLabel: "Emergencias Australia",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Camberra",
        value: "+61262733555",
        note: "Lun–Vie 9:00–13:30",
      },
    },
  },
  {
    keys: ["canadá", "canada"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias Canadá",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Ottawa",
        value: "+16137472252",
        note: "Lun–Vie 9:00–13:00",
      },
    },
  },
  {
    keys: ["nueva zelanda"],
    data: {
      emergencyNumber: "111",
      emergencyLabel: "Emergencias Nueva Zelanda",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Wellington",
        value: "+6444153952",
      },
    },
  },
  {
    keys: ["francia", "france"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en París",
        value: "+33144431800",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["alemania", "germany", "deutschland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Berlín",
        value: "+492302540070",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["italia", "italy"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Roma",
        value: "+390668404001",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["portugal"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Lisboa",
        value: "+351213472381",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["grecia", "greece"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Atenas",
        value: "+302103456041",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["países bajos", "paises bajos", "holanda", "netherlands"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en La Haya",
        value: "+31703643814",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["bélgica", "belgica", "belgium"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Bruselas",
        value: "+3225093800",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["austria"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Viena",
        value: "+43150679880",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["suiza", "switzerland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Número europeo de emergencias",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Berna",
        value: "+41313508282",
        note: "Lun–Vie 9:00–13:00",
      },
    },
  },
  {
    keys: ["japón", "japon", "japan"],
    data: {
      emergencyNumber: "119",
      emergencyLabel: "Ambulancia / Bomberos Japón",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Tokio",
        value: "+81335838531",
        note: "Policía: 110",
      },
    },
  },
  {
    keys: ["china"],
    data: {
      emergencyNumber: "120",
      emergencyLabel: "Ambulancia China",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Pekín",
        value: "+861065323629",
        note: "Policía: 110  |  Bomberos: 119",
      },
    },
  },
  {
    keys: ["corea", "korea"],
    data: {
      emergencyNumber: "119",
      emergencyLabel: "Ambulancia / Bomberos Corea",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Seúl",
        value: "+8227943581",
        note: "Policía: 112",
      },
    },
  },
  {
    keys: ["tailandia", "thailand"],
    data: {
      emergencyNumber: "1669",
      emergencyLabel: "Ambulancia Tailandia",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Bangkok",
        value: "+6626618284",
        note: "Policía turista: 1155",
      },
    },
  },
  {
    keys: ["marruecos", "morocco"],
    data: {
      emergencyNumber: "15",
      emergencyLabel: "Ambulancia Marruecos",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Rabat",
        value: "+212537633900",
        note: "Policía: 19  |  Bomberos: 15",
      },
    },
  },
  {
    keys: ["egipto", "egypt"],
    data: {
      emergencyNumber: "123",
      emergencyLabel: "Ambulancia Egipto",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en El Cairo",
        value: "+20223636625",
        note: "Policía: 122",
      },
    },
  },
  {
    keys: ["emiratos", "dubai", "abu dhabi", "uae"],
    data: {
      emergencyNumber: "999",
      emergencyLabel: "Emergencias Emiratos",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Abu Dabi",
        value: "+97124269644",
        note: "Ambulancia: 998",
      },
    },
  },
  {
    keys: ["turquía", "turquia", "turkey"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias Turquía",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Ankara",
        value: "+903124380392",
        note: "Lun–Vie 9:00–13:00",
      },
    },
  },
  {
    keys: ["méxico", "mexico"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias México",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Ciudad de México",
        value: "+5255528229744",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["argentina"],
    data: {
      emergencyNumber: "911",
      emergencyLabel: "Emergencias Argentina",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Buenos Aires",
        value: "+541148190031",
        note: "Ambulancia: 107",
      },
    },
  },
  {
    keys: ["brasil", "brazil"],
    data: {
      emergencyNumber: "192",
      emergencyLabel: "Ambulancia Brasil",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Brasilia",
        value: "+556132424848",
        note: "Policía: 190  |  Bomberos: 193",
      },
    },
  },
  {
    keys: ["colombia"],
    data: {
      emergencyNumber: "123",
      emergencyLabel: "Emergencias Colombia",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Bogotá",
        value: "+5716574090",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
  {
    keys: ["perú", "peru"],
    data: {
      emergencyNumber: "117",
      emergencyLabel: "Ambulancia Perú",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Lima",
        value: "+5112127295",
        note: "Policía: 105",
      },
    },
  },
  {
    keys: ["india"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias India",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Nueva Delhi",
        value: "+911123792085",
        note: "Ambulancia: 102  |  Policía: 100",
      },
    },
  },
  {
    keys: ["irlanda", "ireland"],
    data: {
      emergencyNumber: "112",
      emergencyLabel: "Emergencias Irlanda",
      consulate: {
        kind: "consulate",
        label: "Embajada de España en Dublín",
        value: "+35312691640",
        note: "Lun–Vie 9:00–14:00",
      },
    },
  },
];

const DEFAULT: CountryData = {
  emergencyNumber: "112",
  emergencyLabel: "Número de emergencias",
};

export const getCountryEmergency = (country: string): CountryData => {
  const normalized = country.toLowerCase().trim();
  const match = COUNTRY_DATA.find((entry) =>
    entry.keys.some((key) => normalized.includes(key))
  );
  return match?.data ?? DEFAULT;
};

export const buildDefaultContacts = (country: string): Contact[] => {
  const data = getCountryEmergency(country);
  if (!data.consulate) return [];
  return [{ id: uid(), ...data.consulate }];
};
