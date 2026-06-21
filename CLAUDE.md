# CLAUDE.md

Contexte projet pour Claude Code. Lis ce fichier en premier.

## Ce qu'est le projet

**Itinera** — un gestionnaire d'itinéraires de voyage **multi-voyages**. L'utilisateur a une
liste de voyages ; pour chacun, une vue mobile à 5 onglets affiche le séjour jour par jour.

- **Inicio** — hero du voyage (dégradé propre au voyage), compte à rebours / jour en cours, résumé, plan du jour, accès rapides.
- **Días** — sélecteur de jours horizontal + timeline verticale color-codée par type (vol / hôtel / visite / traslado / libre).
- **Mapa** — la route ville par ville (lien « Ouvrir dans Google Maps »). Pas de tuiles externes pour l'instant.
- **Frases** — phrases source→destination, filtrables par catégorie + recherche, lecture audio (Web Speech API).
- **Ayuda** — numéro d'urgence local + contacts (assurance, consulat, blocage de carte…), en `tel:` / `mailto:`.

L'UI est en **espagnol** (le voyageur cible est hispanophone). Garder cette langue.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v3 (layout) + styles inline pour les couleurs/dégradés (palette dans `lib/theme.ts`)
- `next/font` : Fraunces (display) + Manrope (texte)
- `lucide-react` pour les icônes
- Aucune autre dépendance.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de prod
npm run lint
```

## Arborescence

```
app/
  layout.tsx            polices + métadonnées
  page.tsx              liste des voyages (Mis viajes) + création/suppression
  trip/[id]/page.tsx    shell du voyage : état onglet + jour, PhoneFrame + BottomNav
components/
  PhoneFrame.tsx        cadre type téléphone (centré, responsive)
  BottomNav.tsx         barre flottante 5 onglets (verre dépoli)
  ui/Sections.tsx       Header, SectionTitle
  trips/                TripCard, NewTripDialog
  tabs/                 InicioTab, DiasTab, MapaTab, FrasesTab, AyudaTab
lib/
  types.ts              modèle de domaine (Trip, TripDay, ItineraryItem, City, Contact, Phrase)
  theme.ts              palette + variables de police
  itinerary.ts          TYPE_META : libellé/couleur/icône par type d'item
  format.ts             dates (Intl), statut/compte à rebours, mapsUrl, speak, uid
  store.ts              ★ couche de données (localStorage) — POINT DE BASCULE backend
  data/sample-trips.ts  2 voyages d'exemple (USA luna de miel, escapade Lisbonne)
```

## Modèle de données

Tout est générique (voir `lib/types.ts`). Un `Trip` contient `days[]` (chacun avec des
`items[]` typés `flight | hotel | activity | transfer | free`), `cities[]`, `contacts[]`,
`phrases[]`, un `theme` (dégradé), `emergencyNumber`/`emergencyLabel` et `speakLang` (BCP-47
pour la synthèse vocale). Rien n'est spécifique au voyage de noces : c'était juste un exemple.

## ★ Point de bascule vers un vrai backend

Toute la persistance vit dans **`lib/store.ts`** (aujourd'hui localStorage + hooks). Le reste
de l'app ne consomme que le type `Trip`, donc seul ce fichier change pour brancher une base.

Pour passer à **Supabase / Prisma** (ta stack habituelle, cf. Appel Internat / Camio) :

1. Créer le schéma (`trips` + tables liées, ou un JSONB pour `days/cities/contacts/phrases` au début).
2. Remplacer `getTrips`/`getTrip` par des lectures serveur ; rendre `trip/[id]/page.tsx` en Server Component qui fetch par id.
3. Remplacer `createTrip`/`deleteTrip` par des **Server Actions** + `revalidatePath`.
4. Pour du multi-utilisateur : ajouter l'auth et filtrer par `userId` (le pattern multi-tenant `internatId` d'Appel Internat se transpose directement).

## Prochaines étapes suggérées (roadmap)

- [ ] **Édition fine** : ajouter/éditer jours et items (formulaires ou édition inline). Aujourd'hui la création couvre les champs d'en-tête ; le détail jour par jour se peuple via `sample-trips.ts` ou se construira via ces formulaires.
- [ ] **Persistance Supabase** (cf. point de bascule).
- [ ] **Carte réelle** : Leaflet + OpenStreetMap dans `MapaTab` (pins sur `cities[]`).
- [ ] **Import** : créer un voyage à partir d'un PDF/email d'itinéraire (parsing → `Trip`).
- [ ] **i18n** : l'UI est en dur en espagnol ; extraire les chaînes si besoin de FR/EN.
- [ ] **PWA / offline** : utile en voyage (cache + accès hors-ligne), comme sur Appel Internat.

## Conventions

- Composants présentationnels = `"use client"` quand ils ont un état ou des handlers.
- Couleurs et dégradés via `lib/theme.ts` (styles inline), layout via Tailwind. Si tu refactores vers du Tailwind pur, passe la palette en variables CSS dans `globals.css` et étends `tailwind.config.ts`.
- Dates toujours en ISO `yyyy-mm-dd` dans les données ; formatage via `lib/format.ts` (`Intl`, locale `es-ES`).
- Pas de `localStorage` ailleurs que dans `lib/store.ts`.
