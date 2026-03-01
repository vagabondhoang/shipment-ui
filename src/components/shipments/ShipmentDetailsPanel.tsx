import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";
import type { Shipment } from "@/types/shipment";
import { deleteShipment } from "@/api/shipments.api";
import { ShipmentMap } from "./ShipmentMap";
import { fetchAssignments } from "@/api/assignments.api";
import type { Assignment } from "@/types/assignment";
import { toDateInputValue } from "@/utils/shipment";
import { ConfirmDialog } from "../common/ConfirmDialog";

import {
  updateShipmentWithAssignmentSync,
  recalculateAssignmentStatus,
} from "@/services/shipmentDomain";

function DetailRow({
  label,
  extra,
  children,
}: {
  label: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {label}
        {extra}
      </div>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  boxSizing: "border-box" as const,
};
const readOnlyInputStyle = {
  ...inputStyle,
  backgroundColor: "#f9fafb",
  border: "1px solid #eee",
  color: "#9ca3af",
};
const primaryBtnStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  height: "fit-content",
  whiteSpace: "nowrap",
};
const secondaryBtnStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  height: "fit-content",
};

function buildInitialValues(shipment: Shipment) {
  return {
    status: shipment.status,
    assignment_id: shipment.assignment_id || "",
    lat: shipment.lat,
    lng: shipment.lng,
    arrival_date: toDateInputValue(shipment.arrival_date),
    delivery_by_date: toDateInputValue(shipment.delivery_by_date),
  };
}

export function ShipmentDetailsPanel({
  shipment,
  hideMap = false,
  onSelect,
  refetch,
}: {
  shipment: Shipment;
  hideMap?: boolean;
  onSelect?: (id: string) => void;
  refetch?: (params?: boolean) => void;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initialValuesRef = useRef(buildInitialValues(shipment));

  const [formValues, setFormValues] = useState(() =>
    buildInitialValues(shipment)
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const next = buildInitialValues(shipment);

    initialValuesRef.current = next;
    setFormValues(next);
    setIsDirty(false);
  }, [shipment.id]);

  function updateField<K extends keyof typeof initialValuesRef.current>(
    key: K,
    value: (typeof initialValuesRef.current)[K]
  ) {
    setFormValues((prev) => {
      const next = { ...prev, [key]: value };

      const dirty = Object.keys(initialValuesRef.current).some(
        (k) =>
          next[k as keyof typeof next] !==
          initialValuesRef.current[k as keyof typeof next]
      );

      setIsDirty(dirty);
      return next;
    });
  }

  const isStatusDisabled =
    formValues.status === "OPEN" && !formValues.assignment_id;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const updated = await updateShipmentWithAssignmentSync(
        shipment,
        formValues
      );

      toast.success("Shipment updated successfully");

      const assignmentChanged =
        !updated.assignment_id ||
        shipment.assignment_id !== formValues.assignment_id;

      refetch?.(assignmentChanged);

      initialValuesRef.current = formValues;
      setIsDirty(false);

      if (!assignmentChanged) {
        refetch?.();
        return;
      }

      refetch?.(assignmentChanged);
    } catch (error) {
      console.error("Failed to update shipment:", error);
      toast.error("Failed to update shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAssignments()
      .then((data) => {
        setAssignments(data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch assignments for details panel:", err);
      });

    onSelect?.(shipment.id);
  }, [shipment.id, onSelect]);

  const handleDelete = async () => {
    try {
      const assignmentId = shipment.assignment_id;
      await deleteShipment(shipment.id);

      if (assignmentId) {
        await recalculateAssignmentStatus(assignmentId);
      }
      toast.success("Shipment deleted successfully");
      setShowDeleteConfirm(false);
      refetch?.();
    } catch (error) {
      toast.error(`Failed to delete shipment ${shipment.id}: ${error}`);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        key={shipment.id}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 8,
          }}
        >
          <h2 style={{ fontSize: 20, margin: 0 }}>Shipment Details</h2>
          {!isDirty && (
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
              🗑 Delete shipment
            </button>
          )}
          {isDirty && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                disabled={isSubmitting}
                style={secondaryBtnStyle}
                onClick={() => {
                  setFormValues(initialValuesRef.current);
                  setIsDirty(false);
                }}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={primaryBtnStyle}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <fieldset
          disabled={isSubmitting}
          style={{
            border: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <DetailRow label="Client Name">
            <input
              name="client_name"
              defaultValue={shipment.client_name}
              readOnly
              style={readOnlyInputStyle}
            />
          </DetailRow>

          <DetailRow label="Container Label">
            <input
              name="container_label"
              defaultValue={shipment.container_label}
              readOnly
              style={readOnlyInputStyle}
            />
          </DetailRow>

          <DetailRow label="Status">
            <select
              name="status"
              value={formValues.status}
              onChange={(e) =>
                updateField("status", e.target.value as ShipmentStatus)
              }
              disabled={isStatusDisabled}
              style={inputStyle}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {isStatusDisabled && (
              <div style={{ marginTop: 4, color: "#1d4ed8", fontSize: 11 }}>
                * Please assign this shipment before updating status from OPEN.
              </div>
            )}
            {!isStatusDisabled &&
              initialValuesRef.current?.status !== "OPEN" && (
                <div style={{ marginTop: 4, color: "#1d4ed8", fontSize: 11 }}>
                  * Changing status to OPEN will unassign the shipment from any
                  assignment.
                </div>
              )}
          </DetailRow>
          <DetailRow label="Assignment">
            <select
              name="assignment_id"
              value={formValues.assignment_id ?? ""}
              onChange={(e) => updateField("assignment_id", e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Select Assignment --</option>
              {assignments.map((as) => (
                <option key={as.id} value={String(as.id)}>
                  {as.label} ({as.id})
                </option>
              ))}
            </select>
          </DetailRow>

          <DetailRow label="Arrival Date">
            <input
              type="date"
              name="arrival_date"
              value={formValues.arrival_date}
              onChange={(e) => updateField("arrival_date", e.target.value)}
              style={inputStyle}
            />
          </DetailRow>
          <DetailRow label="Delivery By">
            <input
              type="date"
              name="delivery_by_date"
              value={formValues.delivery_by_date}
              onChange={(e) => updateField("delivery_by_date", e.target.value)}
              style={inputStyle}
            />
          </DetailRow>

          <DetailRow label="Lat">
            <input
              name="lat"
              type="number"
              step="any"
              min={32.55}
              max={33.05}
              value={formValues.lat}
              onChange={(e) => updateField("lat", parseFloat(e.target.value))}
              style={inputStyle}
            />
          </DetailRow>
          <DetailRow label="Lng">
            <input
              name="lng"
              type="number"
              step="any"
              min={-97.4}
              max={-96.5}
              value={formValues.lng}
              onChange={(e) => updateField("lng", parseFloat(e.target.value))}
              style={inputStyle}
            />
          </DetailRow>
          <DetailRow label="Warehouse">{shipment.warehouse_id}</DetailRow>
        </fieldset>
      </form>

      {/* Map */}
      {!hideMap && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Shipment Location
          </div>
          {formValues.lat && formValues.lng ? (
            <ShipmentMap lat={formValues.lat} lng={formValues.lng} />
          ) : (
            <div
              style={{
                height: 250,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              No location data available
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete shipment?"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      >
        <>
          This action <strong>cannot be undone</strong>.
          <br />
          The shipment and all related data will be permanently removed.
        </>
      </ConfirmDialog>
    </>
  );
}
