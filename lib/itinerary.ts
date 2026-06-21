import { Plane, BedDouble, Ticket, Car, Coffee, TrainFront, Sailboat, type LucideIcon } from "lucide-react";
import { C } from "./theme";
import type { ItemType } from "./types";

export interface TypeMeta {
  label: string;
  color: string;
  bg: string;
  Icon: LucideIcon;
}

export const TYPE_META: Record<ItemType, TypeMeta> = {
  flight: { label: "Vuelo", color: C.dusk, bg: "#EAF1F6", Icon: Plane },
  hotel: { label: "Hotel", color: C.plum, bg: "#F6EBF1", Icon: BedDouble },
  activity: { label: "Visita", color: C.amber, bg: "#FBF0E0", Icon: Ticket },
  transfer: { label: "Traslado", color: C.dusk, bg: "#EAF1F6", Icon: Car },
  free: { label: "Libre", color: C.inkSoft, bg: "#F2EAE4", Icon: Coffee },
  train: { label: "Tren", color: C.dusk, bg: "#EAF1F6", Icon: TrainFront },
  ship: { label: "Barco", color: C.dusk, bg: "#EAF1F6", Icon: Sailboat },
};

export function metaFor(type: ItemType): TypeMeta {
  return TYPE_META[type] ?? TYPE_META.activity;
}
