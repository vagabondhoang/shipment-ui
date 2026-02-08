import type { ShipmentStatus } from "@/types/shipment";

export function readShipmentQuery() {
  const params = new URLSearchParams(window.location.search);

  return {
    q: params.get("q") ?? "",
    statuses: (params.get("status")?.split(",") ??
      []) as ShipmentStatus[],
  };
}

export function writeShipmentQuery(
  q: string,
  statuses: ShipmentStatus[]
) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (statuses.length) params.set("status", statuses.join(","));

  const query = params.toString();
  const url = query ? `?${query}` : window.location.pathname;

  window.history.replaceState(null, "", url);
}
