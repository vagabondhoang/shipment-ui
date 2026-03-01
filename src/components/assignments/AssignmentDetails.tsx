import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import type { Assignment } from "@/types/assignment";

import { groupShipmentsByStatus } from "@/utils/shipment";
import { ShipmentListItem } from "@/components/shipments/ShipmentListItem";
import { ShipmentGroup } from "@/components/shipments/ShipmentGroup";
import type { Shipment } from "@/types/shipment";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { deleteAssignment } from "@/api/assignments.api";

interface AssignmentDetailsProps {
  assignment: Assignment;
  selectedShipment: Shipment;
  onSelect: (shipment: Shipment) => void;
  setAllShipments?: (shipments: Shipment[]) => void;
  shipments?: Shipment[];
  onSuccess: () => void;
}
export const AssignmentDetails = ({
  assignment,
  selectedShipment,
  onSelect,
  shipments,
  onSuccess,
}: AssignmentDetailsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const grouped = useMemo(
    () => groupShipmentsByStatus(shipments ?? []),
    [shipments]
  );

  const handleDelete = async () => {
    try {
      await deleteAssignment(assignment.id);
      setShowDeleteConfirm(false);
      toast.success("Assignment deleted successfully!");
      onSuccess();
    } catch (error) {
      toast.error(`Failed to delete assignment. Please try again. ${error}`);
    }
  };

  return (
    <>
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
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>{assignment?.label}</div>
          {shipments?.length === 0 && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                background: "transparent",
                color: "#dc2626",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              🗑 Delete assignment
            </button>
          )}
        </div>
        {assignment?.clients?.length > 0 && (
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Clients: {assignment.clients.join(", ")}
          </div>
        )}
        {(shipments ?? []).length > 0 && (
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Toal Shipments: {(shipments ?? []).length}
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
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete shipment?"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      >
        <>
          This action <strong>cannot be undone</strong>.
          <br />
          The assignment and all related data will be permanently removed.
        </>
      </ConfirmDialog>
    </>
  );
};
