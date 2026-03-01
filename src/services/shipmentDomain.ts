import { updateAssignment } from "@/api/assignments.api";
import { fetchShipmentsByAssignment, updateShipment } from "@/api/shipments.api";
import type { Shipment, ShipmentStatus } from "@/types/shipment";
import { syncAssignmentStatus } from "@/utils/shipment";

type ShipmentFormValues = {
  status: ShipmentStatus;
  assignment_id?: string | null;
  lat?: number;
  lng?: number;
  arrival_date: string;        
  delivery_by_date: string;
};

export async function recalculateAssignmentStatus(assignmentId: string) {
  const shipments = await fetchShipmentsByAssignment(assignmentId);

  const nextStatus = syncAssignmentStatus(shipments);
  const shipmentCount = shipments.length;

  await updateAssignment(assignmentId, {
    status: nextStatus,
    shipment_count: shipmentCount,
    clients: Array.from(new Set(shipments.map((s) => s.client_name))),
  });
}

export async function updateShipmentWithAssignmentSync(
  shipment: Shipment,
  formValues: ShipmentFormValues
) {
  const prevStatus = shipment.status;
  const prevAssignmentId = shipment.assignment_id;
  const nextStatus = formValues.status;

  const payload = {
    ...formValues,
    assignment_id:
      prevStatus !== nextStatus && nextStatus === "OPEN"
        ? null
        : formValues.assignment_id,
    arrival_date: new Date(formValues.arrival_date).toISOString(),
    delivery_by_date: new Date(formValues.delivery_by_date).toISOString(),
  };

  const updated = await updateShipment(shipment.id, payload);
  const assignmentChanged =
        !updated.assignment_id ||
        shipment.assignment_id !== formValues.assignment_id;

  if(!assignmentChanged) return updated;

  const affectedAssignmentIds = new Set<string>();

  if (prevAssignmentId) affectedAssignmentIds.add(prevAssignmentId);
  if (updated.assignment_id) affectedAssignmentIds.add(updated.assignment_id);

  for (const id of affectedAssignmentIds) {
    const shipments = await fetchShipmentsByAssignment(id);
    const nextStatus = syncAssignmentStatus(shipments);

    await updateAssignment(id, {
      status: nextStatus,
      shipment_count: shipments.length,
      clients: Array.from(new Set(shipments.map((s) => s.client_name))),
    });
  }

  return updated;
}