import type { Shipment, ShipmentStatus } from "@/types/shipment";
import type { AssignmentStatus } from "@/types/assignment";

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

export function syncAssignmentStatus(
  shipments: { status: ShipmentStatus }[]
): AssignmentStatus {
  if (shipments.length === 0) {
    return "OPEN";
  }

  const allDelivered = shipments.every(s => s.status === "DELIVERED");
  if (allDelivered) {
    return "DELIVERED";
  }

  const allOpen = shipments.every(s => s.status === "OPEN");
  if (allOpen) {
    return "OPEN";
  }

  return "IN_TRANSIT";
}

