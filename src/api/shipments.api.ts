import type { Shipment, ShipmentStatus } from "@/types/shipment";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";


export interface FetchShipmentsParams {
  page: number;
  perPage: number;
  q?: string;
  statuses?: string[];
}

export async function fetchShipments(
  params: FetchShipmentsParams
): Promise<{ data: Shipment[]; total: number }> {
  const search = new URLSearchParams();
  search.set("_page", String(params.page));
  // For json-server v1.x use _per_page instead of _limit
  search.set("_limit", String(params.perPage));

  if (params.q) search.set("q", params.q);

  if (params.statuses?.length) {
    params.statuses.forEach((s) => search.append("status", s));
  }

  const res = await fetch(`${BASE_URL}/shipments?${search.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch shipments");

  return {
    data: await res.json(),
    total: Number(res.headers.get("X-Total-Count") || 0),
  };
}

export async function updateShipment(id: string,
  data: {
    status?: ShipmentStatus; assignment_id?: string | null; arrival_date?: string; delivery_by_date?: string; lat?: number;
    lng?: number;
  }): Promise<Shipment> {
  const res = await fetch(`${BASE_URL}/shipments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update shipment');
  }
  return res.json();
}