import type { Trip } from "../types";

/**
 * Seed trips. These are loaded the first time the app runs and then live in
 * the store (localStorage today, Supabase tomorrow — see lib/store.ts).
 * Replace freely or delete; nothing here is special-cased.
 */
export const SAMPLE_TRIPS: Trip[] = [
  {
    id: "usa-luna-de-miel",
    title: "Costa a costa",
    tagline: "Luna de miel",
    travelers: "Lucía & Daniel",
    country: "Estados Unidos",
    startDate: "2026-07-04",
    endDate: "2026-07-13",
    theme: { from: "#7A4A6B", mid: "#E0654F", to: "#E69B45" },
    emergencyNumber: "911",
    emergencyLabel: "Policía · Bomberos · Ambulancia (EE. UU.)",
    speakLang: "en-US",
    days: [
      {
        id: "d1",
        date: "2026-07-04",
        city: "Madrid → Nueva York",
        items: [
          { id: "d1a", type: "flight", time: "10:40", title: "Vuelo MAD → JFK", detail: "Iberia IB6253 · T4S · Asientos 14A/14B · Conf. KQ8ZP1", note: "Llegada 13:25 hora local. 8 h 45 min." },
          { id: "d1b", type: "hotel", time: "16:00", title: "Check-in · The Standard High Line", detail: "848 Washington St, Nueva York · Conf. STD-99210", note: "2 noches · vistas al río Hudson" },
        ],
      },
      {
        id: "d2",
        date: "2026-07-05",
        city: "Nueva York",
        items: [
          { id: "d2a", type: "activity", time: "09:30", title: "Bajo Manhattan + Estatua de la Libertad", detail: "Battery Park, taquilla 3 · NY See Tours · Conf. NYS-4471", note: "Ferry a Liberty Island y Ellis Island. ~4 h." },
          { id: "d2b", type: "hotel", time: "—", title: "Noche · The Standard High Line", detail: "848 Washington St, Nueva York" },
        ],
      },
      {
        id: "d3",
        date: "2026-07-06",
        city: "Nueva York",
        items: [
          { id: "d3a", type: "free", time: "Libre", title: "Central Park y Top of the Rock", detail: "Entradas Top of the Rock 18:00 · Conf. TOR-7782", note: "Sugerencia: alquilar bici en el parque por la mañana." },
        ],
      },
      {
        id: "d4",
        date: "2026-07-07",
        city: "Nueva York → Las Vegas",
        items: [
          { id: "d4a", type: "flight", time: "11:15", title: "Vuelo JFK → LAS", detail: "Delta DL1422 · T4 · Asientos 9C/9D · Conf. R7M2QX", note: "Llegada 14:05 hora local. 5 h 50 min." },
          { id: "d4b", type: "hotel", time: "15:30", title: "Check-in · The Venetian Resort", detail: "3355 S Las Vegas Blvd · Conf. VEN-30188", note: "2 noches · suite con vistas al Strip" },
        ],
      },
      {
        id: "d5",
        date: "2026-07-08",
        city: "Las Vegas",
        items: [
          { id: "d5a", type: "activity", time: "06:45", title: "Excursión · Gran Cañón (South Rim)", detail: "Recogida en el hotel · Grand Canyon Day Tours · Conf. GC-5590", note: "Avioneta + bus. Día completo. Lleva agua y gorra." },
        ],
      },
      {
        id: "d6",
        date: "2026-07-09",
        city: "Las Vegas → San Francisco",
        items: [
          { id: "d6a", type: "flight", time: "13:20", title: "Vuelo LAS → SFO", detail: "United UA512 · T3 · Asientos 7A/7B · Conf. T9KP2M", note: "Llegada 15:05 hora local. 1 h 45 min." },
          { id: "d6b", type: "hotel", time: "16:30", title: "Check-in · Hotel Zephyr, Fisherman's Wharf", detail: "250 Beach St, San Francisco · Conf. ZEP-11823", note: "4 noches · habitación con terraza" },
        ],
      },
      {
        id: "d7",
        date: "2026-07-10",
        city: "San Francisco",
        items: [
          { id: "d7a", type: "activity", time: "09:00", title: "Alcatraz + Golden Gate en bici", detail: "Pier 33 · Bay City Bike · Conf. BCB-2204", note: "Ferry a Alcatraz por la mañana, ruta en bici por la tarde." },
        ],
      },
      {
        id: "d8",
        date: "2026-07-11",
        city: "Napa Valley",
        items: [
          { id: "d8a", type: "activity", time: "08:30", title: "Napa Valley y cata de vinos", detail: "Recogida en el hotel · Napa Wine Tours · Conf. NWT-6611", note: "3 bodegas + almuerzo incluido. Regreso ~18:00." },
        ],
      },
      {
        id: "d9",
        date: "2026-07-12",
        city: "San Francisco → Madrid",
        items: [
          { id: "d9a", type: "free", time: "Mañana", title: "Mañana libre en San Francisco", detail: "Check-out 12:00. Equipaje en consigna del hotel." },
          { id: "d9b", type: "flight", time: "18:40", title: "Vuelo SFO → MAD", detail: "Iberia IB6166 (nocturno) · T1 internacional · Conf. KQ8ZP1", note: "Vuelo nocturno, llegada al día siguiente." },
        ],
      },
      {
        id: "d10",
        date: "2026-07-13",
        city: "Llegada a Madrid",
        items: [
          { id: "d10a", type: "flight", time: "14:25", title: "Llegada a Madrid (MAD) · T4", detail: "Fin del viaje. ¡Bienvenidos a casa!" },
        ],
      },
    ],
    cities: [
      { id: "c1", name: "Nueva York", stay: "4–6 jul · 2 noches", hotel: "The Standard High Line", highlights: ["Estatua de la Libertad", "Central Park", "Top of the Rock"], mapsQuery: "The Standard High Line, New York" },
      { id: "c2", name: "Las Vegas", stay: "7–8 jul · 2 noches", hotel: "The Venetian Resort", highlights: ["The Strip", "Gran Cañón"], mapsQuery: "The Venetian Resort Las Vegas" },
      { id: "c3", name: "San Francisco", stay: "9–12 jul · 4 noches", hotel: "Hotel Zephyr", highlights: ["Golden Gate", "Alcatraz", "Napa Valley"], mapsQuery: "Hotel Zephyr Fisherman's Wharf San Francisco" },
    ],
    contacts: [
      { id: "ct1", kind: "insurance", label: "Asistencia 24h · VECI", value: "+34 911 23 45 67", note: "Seguro de viaje · Póliza VC-2026-884512" },
      { id: "ct2", kind: "email", label: "Email de siniestros VECI", value: "siniestros@veci.es", note: "Para abrir parte (guarda facturas y fotos)" },
      { id: "ct3", kind: "consulate", label: "Consulado de España · Nueva York", value: "+1 212 355 4080", note: "150 E 58th St, Nueva York" },
      { id: "ct4", kind: "consulate", label: "Consulado de España · San Francisco", value: "+1 415 922 2995", note: "1405 Sutter St, San Francisco" },
      { id: "ct5", kind: "card", label: "Bloqueo de tarjeta (24h)", value: "+34 900 80 50 60", note: "Teléfono de tu banco" },
    ],
    phrases: [
      { id: "p1", category: "Saludos", source: "Buenos días, ¿cómo está?", target: "Good morning, how are you?" },
      { id: "p2", category: "Saludos", source: "Muchas gracias, muy amable.", target: "Thank you very much, that's very kind." },
      { id: "p3", category: "Restaurante", source: "Una mesa para dos, por favor.", target: "A table for two, please." },
      { id: "p4", category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "Can we have the check, please?" },
      { id: "p5", category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Do you have gluten-free options?" },
      { id: "p6", category: "Hotel", source: "Tengo una reserva a nombre de…", target: "I have a reservation under the name…" },
      { id: "p7", category: "Hotel", source: "¿A qué hora es el check-out?", target: "What time is check-out?" },
      { id: "p8", category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "How do I get to the airport?" },
      { id: "p9", category: "Compras", source: "¿Cuánto cuesta esto?", target: "How much is this?" },
      { id: "p10", category: "Compras", source: "¿Aceptan tarjeta?", target: "Do you take card?" },
      { id: "p11", category: "Emergencias", source: "Necesito ayuda, por favor.", target: "I need help, please." },
      { id: "p12", category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Where is the nearest hospital?" },
      { id: "p13", category: "Emergencias", source: "He perdido mi pasaporte.", target: "I've lost my passport." },
    ],
  },

  {
    id: "lisboa-finde",
    title: "Escapada a Lisboa",
    tagline: "Fin de semana",
    travelers: "Marta & Pablo",
    country: "Portugal",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    theme: { from: "#2E6E7E", mid: "#3F9E8C", to: "#E6B84F" },
    emergencyNumber: "112",
    emergencyLabel: "Emergencias (Unión Europea)",
    speakLang: "pt-PT",
    days: [
      {
        id: "l1",
        date: "2026-09-18",
        city: "Madrid → Lisboa",
        items: [
          { id: "l1a", type: "flight", time: "19:10", title: "Vuelo MAD → LIS", detail: "TAP TP1023 · T1 · Conf. LX44PT", note: "Llegada 19:50. 1 h 40 min." },
          { id: "l1b", type: "hotel", time: "21:00", title: "Check-in · Hotel Alfama", detail: "Rua de São João da Praça, Lisboa · Conf. ALF-2210" },
        ],
      },
      {
        id: "l2",
        date: "2026-09-19",
        city: "Lisboa",
        items: [
          { id: "l2a", type: "activity", time: "10:00", title: "Tour a pie por Alfama y Castelo", detail: "Punto de encuentro: Praça do Comércio" },
          { id: "l2b", type: "free", time: "Tarde", title: "Tranvía 28 y pastéis de Belém", detail: "Sugerencia: ir temprano a la pastelería de Belém." },
        ],
      },
      {
        id: "l3",
        date: "2026-09-20",
        city: "Lisboa → Madrid",
        items: [
          { id: "l3a", type: "free", time: "Mañana", title: "Mercado da Ribeira", detail: "Check-out 11:00." },
          { id: "l3b", type: "flight", time: "17:30", title: "Vuelo LIS → MAD", detail: "TAP TP1024 · Conf. LX44PT" },
        ],
      },
    ],
    cities: [
      { id: "lc1", name: "Lisboa", stay: "18–20 sep · 2 noches", hotel: "Hotel Alfama", highlights: ["Alfama", "Belém", "Tranvía 28"], mapsQuery: "Alfama Lisboa Portugal" },
    ],
    contacts: [
      { id: "lct1", kind: "insurance", label: "Asistencia 24h · seguro", value: "+34 900 00 00 00", note: "Añade aquí tu póliza" },
      { id: "lct2", kind: "consulate", label: "Embajada de España · Lisboa", value: "+351 213 472 381", note: "Rua do Salitre 1, Lisboa" },
    ],
    phrases: [
      { id: "lp1", category: "Saludos", source: "Buenos días, gracias.", target: "Bom dia, obrigado." },
      { id: "lp2", category: "Restaurante", source: "La cuenta, por favor.", target: "A conta, por favor." },
      { id: "lp3", category: "Transporte", source: "¿Dónde está la estación?", target: "Onde fica a estação?" },
      { id: "lp4", category: "Emergencias", source: "Necesito un médico.", target: "Preciso de um médico." },
    ],
  },
];
