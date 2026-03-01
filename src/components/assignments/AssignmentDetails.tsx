import { useState, useEffect, useMemo } from "react";
import type { Assignment } from "@/types/assignment";

import { fetchShipmentsByAssignment } from "@/api/shipments.api";
import { groupShipmentsByStatus } from "@/utils/shipment";
import { ShipmentListItem } from "@/components/shipments/ShipmentListItem";
import { ShipmentGroup } from "@/components/shipments/ShipmentGroup";
import type { Shipment } from "@/types/shipment";

interface AssignmentDetailsProps {
  assignment: Assignment;
  selectedShipment: Shipment;
  onSelect: (shipment: Shipment) => void;
  deleteAssignmentOptimistic?: (id: string) => void;
  setAllShipments?: (shipments: Shipment[]) => void;
  shipments?: Shipment[];
}
export const AssignmentDetails = ({
  assignment,
  selectedShipment,
  onSelect,
  deleteAssignmentOptimistic,
  shipments,
}: AssignmentDetailsProps) => {
  const grouped = useMemo(
    () => groupShipmentsByStatus(shipments ?? []),
    [shipments]
  );

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
        maxHeight: "calc(100vh - 180px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#111827",
          marginBottom: 4,
        }}
      >
        {assignment?.label}
      </div>
      {assignment?.clients?.length > 0 && (
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
          Clients: {assignment.clients.join(", ")}
        </div>
      )}
      {shipments?.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#111827",
              marginBottom: 4,
            }}
          >
            Toal Shipments: {shipments.length}
          </div>
          {grouped?.map(({ status, items }) => (
            <ShipmentGroup key={status} title={status} count={items.length}>
              {items.map((shipment) => (
                <ShipmentListItem
                  key={shipment.id}
                  shipment={shipment}
                  selected={shipment.id === selectedShipment?.id}
                  onSelect={() => onSelect(shipment)}
                  data-shipment-item={shipment.id}
                />
              ))}
            </ShipmentGroup>
          )) || <div>No shipments assigned</div>}
        </div>
      )}
    </section>
  );
};
