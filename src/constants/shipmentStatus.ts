import type { ShipmentStatus } from "@/types/shipment";

export interface ShipmentStatusOption {
  label: string;
  value: ShipmentStatus;
}

export const STATUS_STYLES: Record<
  ShipmentStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  OPEN: {
    label: "Open",
    color: "#1d4ed8",
    bg: "#e6f0ff",
    border: "#93c5fd",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fcd34d",
  },
  DELIVERED: {
    label: "Delivered",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#6ee7b7",
  },
};

export const STATUS_OPTIONS: ShipmentStatusOption[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
];

export const PAGE_SIZE = 20;

export const MIN_LOADING_TIME = 500;
