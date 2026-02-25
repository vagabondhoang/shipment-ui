import { useState, useEffect, useRef } from "react";
import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";
import type { Shipment } from "@/types/shipment";
import { updateShipment } from "@/api/shipments.api";
import { ShipmentMap } from "./ShipmentMap";
import { fetchAssignments } from "@/api/assignments.api";
import type { Assignment } from "@/types/assignment";
import { toDateInputValue } from "@/utils/shipment";

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
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};
const secondaryBtnStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
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
  onSelect,
  updateShipmentOptimistic,
}: {
  shipment: Shipment;
  onSelect: (id: string) => void;
  updateShipmentOptimistic: (id: string, data: Partial<Shipment>) => void;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const initialValuesRef = useRef(buildInitialValues(shipment));

  const [formValues, setFormValues] = useState(() =>
    buildInitialValues(shipment)
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const prevStatus = initialValuesRef.current.status;
      const status = formValues.status;

      const payload = {
        status,
        assignment_id:
          prevStatus !== status && status === "OPEN"
            ? null
            : formValues.assignment_id,
        lat: formValues.lat,
        lng: formValues.lng,
        arrival_date: new Date(formValues.arrival_date).toISOString(),
        delivery_by_date: new Date(formValues.delivery_by_date).toISOString(),
      };

      await updateShipment(shipment.id, payload);

      const next = {
        ...formValues,
        assignment_id: payload.assignment_id ?? "",
        status: payload.status,
      };

      updateShipmentOptimistic(shipment.id, next);

      initialValuesRef.current = next;
      setFormValues(next);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to update shipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAssignments()
      .then((data) => {
        setAssignments(data);
      })
      .catch((err) => {
        console.error("Failed to fetch assignments for details panel:", err);
      });

    onSelect(shipment.id);
  }, [shipment.id, onSelect]);

  return (
    <>
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          background: "#fff",
          maxHeight: "calc(100vh - 140px)",
          overflowY: "auto",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 20, margin: 0 }}>Shipment Management</h2>
            {isDirty && (
              <div style={{ display: "flex", gap: 8 }}>
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
                name="label"
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
                  * Please assign this shipment before updating status from
                  OPEN.
                </div>
              )}
              {!isStatusDisabled &&
                initialValuesRef.current?.status !== "OPEN" && (
                  <div style={{ marginTop: 4, color: "#1d4ed8", fontSize: 11 }}>
                    * Changing status to OPEN will unassign the shipment from
                    any assignment.
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
                onChange={(e) =>
                  updateField("delivery_by_date", e.target.value)
                }
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
      </section>
    </>
  );
}
