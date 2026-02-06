import type { Shipment, ShipmentStatus } from "@/types/shipment";

const BASE_URL = 'http://localhost:3001';

export async function fetchShipments(): Promise<Shipment[]> {
  const res = await fetch(`${BASE_URL}/shipments`);
  if (!res.ok) {
    throw new Error('Failed to fetch shipments');
  }
  return res.json();
}

export async function updateShipmentStatus(id: string, status: ShipmentStatus): Promise<Shipment> {
  const res = await fetch(`${BASE_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error('Failed to update shipment status');
  }
  return res.json();
}