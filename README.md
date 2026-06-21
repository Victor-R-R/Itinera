<div align="center">

# ✈️ Itinera

**Gestor de itinerarios de viaje — mobile-first, sin backend**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

*Crea, organiza y consulta tus viajes desde el móvil — con itinerario día a día, mapa de ciudades, frases de viaje y contactos de emergencia.*

</div>

---

## 🌟 ¿Qué es Itinera?

Itinera es una aplicación web **progressive mobile-first** que centraliza toda la información de tus viajes en un único lugar. Funciona como una **guía de viaje personal** siempre disponible — sin cuenta, sin backend, sin conexión obligatoria.

Cada viaje abre una interfaz de tipo **teléfono** con 5 pestañas especializadas:

| Pestaña | Icono | Descripción |
|---------|-------|-------------|
| **Inicio** | 🏠 | Hero del viaje, cuenta atrás, plan del día |
| **Días** | 📅 | Timeline día a día con actividades, vuelos, hoteles |
| **Mapa** | 🗺️ | Ruta ciudad por ciudad con acceso a Google Maps |
| **Frases** | 💬 | Frases de viaje con audio (Text-to-Speech) |
| **Ayuda** | 🆘 | Número de emergencia + contactos (seguro, cónsul…) |

---

## 🚀 Arranque rápido

```bash
# Clonar el repositorio
git clone https://github.com/Victor-R-R/Itinera.git
cd Itinera

# Instalar dependencias
npm install

# Arrancar en desarrollo
npm run dev
# → http://localhost:3000
```

> La primera vez se cargan automáticamente **2 viajes de ejemplo** para que puedas explorar la app sin configurar nada.

---

## ✨ Funcionalidades

### 🗂️ Gestión de viajes
- **Crear** viajes con título, destino, fechas y viajeros
- **Editar** los metadatos del viaje en cualquier momento
- **Eliminar** con confirmación (toast de acción Sileo)
- **Perfil de usuario** con estadísticas (total viajes · días · ciudades)

### 📅 Planificación día a día
- Añadir **días** al itinerario con nombre de ciudad editable inline
- Añadir **items** por día: vuelo ✈️, hotel 🏨, actividad 🎯, traslado 🚗, tiempo libre ☀️
- Timeline **color-codada** por tipo de actividad
- **Localización en mapa**: cada item puede tener un lugar que aparece automáticamente en la pestaña Mapa

### 🗺️ Mapa de ruta
- Vista de todas las ciudades del viaje ordenadas
- Acceso directo a **Google Maps** por ciudad
- Ciudades **auto-generadas** desde los items del itinerario

### 💬 Frases de viaje
- Catálogo de frases **fuente → destino** con categorías
- **Audio** con Web Speech API (pronunciación nativa)
- Filtro por categoría + búsqueda en tiempo real
- Frases auto-populadas por idioma del destino al crear el viaje

### 🆘 Ayuda de emergencia
- Número de emergencia local con acceso directo (`tel:`)
- Contactos: seguro, consulado, bloqueo de tarjeta…
- Links `tel:` y `mailto:` directamente desde el móvil

---

## 🏗️ Arquitectura

```
app/
├── layout.tsx               # Fuentes (Fraunces + Manrope) + metadatos
├── page.tsx                 # Perfil de usuario + lista de viajes
├── globals.css              # Estilos globales
└── trip/[id]/page.tsx       # Shell del viaje: BottomNav + pestañas

components/
├── PhoneFrame.tsx            # Marco tipo teléfono (centrado, responsive)
├── BottomNav.tsx             # Barra flotante 5 pestañas (glass effect)
├── SileoProvider.tsx         # Proveedor de notificaciones toast
├── tabs/
│   ├── InicioTab.tsx         # Hero + cuenta atrás + plan del día
│   ├── DiasTab.tsx           # Timeline día a día + edición inline
│   ├── MapaTab.tsx           # Ruta ciudades + Google Maps
│   ├── FrasesTab.tsx         # Frases + audio TTS
│   └── AyudaTab.tsx          # Emergencias + contactos
├── trips/
│   ├── TripCard.tsx          # Tarjeta de viaje en la lista
│   ├── NewTripDialog.tsx     # Modal crear viaje
│   ├── EditTripDialog.tsx    # Modal editar viaje
│   ├── AddDayDialog.tsx      # Modal añadir día
│   └── AddItemDialog.tsx     # Modal añadir item (con autocompletado de lugar)
└── ui/
    └── Sections.tsx          # Header, SectionTitle reutilizables

lib/
├── types.ts                 # 📌 Modelo de dominio completo (Trip, TripDay, Item…)
├── store.ts                 # ⭐ Capa de persistencia (localStorage → punto de bascule backend)
├── theme.ts                 # Paleta de colores y gradientes
├── itinerary.ts             # TYPE_META: icono/color/etiqueta por tipo de item
├── format.ts                # Fechas (Intl), cuenta atrás, URL Maps, uid, TTS
├── phrases.ts               # Catálogo multilingüe de frases + detección por país
└── data/
    └── sample-trips.ts      # 2 viajes de ejemplo (USA, Lisboa)
```

---

## 🔌 Modelo de datos

El modelo es **completamente genérico** — sirve para cualquier tipo de viaje:

```typescript
Trip {
  id, title, tagline, travelers
  country, startDate, endDate
  theme: { from, mid, to }       // gradiente del hero
  emergencyNumber, speakLang     // idioma para TTS
  days: TripDay[]
  cities: City[]
  contacts: Contact[]
  phrases: Phrase[]
}

TripDay {
  date, city
  items: ItineraryItem[]         // flight | hotel | activity | transfer | free
}
```

---

## 🔄 Punto de bascule → Backend real

Toda la persistencia está aislada en **`lib/store.ts`**. El resto de la app solo consume el tipo `Trip`. Para conectar un backend real:

```
1. Crear el esquema en Supabase / Prisma (tabla trips + relaciones)
2. trip/[id]/page.tsx → Server Component con fetch por id
3. createTrip / deleteTrip → Server Actions + revalidatePath
4. Multi-usuario: añadir auth + filtrar por userId
```

---

## 🛠️ Stack técnico

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| [Next.js](https://nextjs.org/) | 15 | Framework fullstack (App Router) |
| [React](https://react.dev/) | 19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipado estricto |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Layout |
| [lucide-react](https://lucide.dev/) | 0.468 | Iconos |
| [Sileo](https://www.npmjs.com/package/sileo) | 0.1 | Notificaciones toast |
| [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | — | Fraunces (display) + Manrope (texto) |
| Web Speech API | nativa | Text-to-Speech en Frases |
| Nominatim (OpenStreetMap) | — | Autocompletado de lugares |

---

## 📋 Roadmap

- [ ] **Edición avanzada** — editar items existentes inline
- [ ] **Backend Supabase** — persistencia real + multi-dispositivo
- [ ] **Mapa real** — Leaflet + OpenStreetMap con pins en `MapaTab`
- [ ] **Import desde PDF** — parsear itinerarios de email/PDF → `Trip`
- [ ] **PWA / offline** — cache + acceso sin conexión (útil en viaje)
- [ ] **Compartir viaje** — link para compartir el itinerario de solo lectura

---

## 📄 Licencia

MIT — libre para uso personal y comercial.

---

<div align="center">

Hecho con ❤️ para viajeros que quieren tenerlo todo organizado

</div>
