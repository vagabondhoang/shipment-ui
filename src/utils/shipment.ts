import type { Shipment, ShipmentStatus } from "@/types/shipment";

const STATUS_ORDER: ShipmentStatus[] = [
  "OPEN",
  "IN_TRANSIT",
  "DELIVERED",
];

export function groupShipmentsByStatus(shipments: Shipment[]) {
  const map: Record<ShipmentStatus, Shipment[]> = {
    OPEN: [],
    IN_TRANSIT: [],
    DELIVERED: [],
  };

  for (const s of shipments) {
    map[s.status].push(s);
  }

  return STATUS_ORDER.map((status) => ({
    status,
    items: map[status],
  }));
}

export function toDateInputValue(date: string | Date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}
