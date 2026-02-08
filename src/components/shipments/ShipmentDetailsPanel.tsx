import { useState, useOptimistic, useTransition } from "react";
import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";
import type { Shipment } from "@/types/shipment";
import { updateShipmentStatus } from "@/api/shipments.api";
import { ConfirmDialog } from "../common/ConfirmDialog";

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
          fontSize: 13,
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

export function ShipmentDetailsPanel({
  shipment,
  onOptimisticUpdate,
  onSelect,
}: {
  shipment: Shipment;
  onOptimisticUpdate: (id: string, status: ShipmentStatus) => void;
  onSelect: (id: string) => void;
}) {
  const status = shipment.status;
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic<ShipmentStatus>(
    shipment.status
  );
  const [pendingStatus, setPendingStatus] = useState<ShipmentStatus | null>(
    null
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPendingStatus(e.target.value as ShipmentStatus);
    setOpenConfirm(true);
    onSelect(shipment.id);
  }

  function confirmUpdate() {
    if (!pendingStatus) return;

    const next = pendingStatus!;
    setIsSubmitting(true);

    startTransition(() => {
      setOptimisticStatus(next);
      onOptimisticUpdate(shipment.id, next);
    });

    (async () => {
      try {
        await updateShipmentStatus(shipment.id, next);
        setOpenConfirm(false);
        // toast success could be added here
      } catch {
        // rollback
        startTransition(() => {
          setOptimisticStatus(shipment.status);
          onOptimisticUpdate(shipment.id, shipment.status);
        });
        // toast error could be added here
      } finally {
        setIsSubmitting(false);
      }
    })();
  }

  return (
    <>
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          background: "#fff",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Container Details</h2>

        <DetailRow label="Client">{shipment?.client_name}</DetailRow>

        <DetailRow label="Container Label">
          {shipment?.container_label}
        </DetailRow>

        <DetailRow
          label="Status"
          extra={
            <abbr
              title="Changing this status will update the shipment"
              style={{
                fontSize: 12,
                color: "#6b7280",
                cursor: "help",
                textDecoration: "none",
              }}
            >
              ⓘ
            </abbr>
          }
        >
          <select
            value={status}
            onChange={handleStatusChange}
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </DetailRow>

        <DetailRow label="Arrival Date">
          {new Date(shipment.arrival_date).toLocaleDateString()}
        </DetailRow>
        <DetailRow label="Delivery By">
          {new Date(shipment.delivery_by_date).toLocaleDateString()}
        </DetailRow>
        <DetailRow label="Warehouse">{shipment.warehouse_id}</DetailRow>
      </section>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={openConfirm}
        confirmLoading={isSubmitting || isPending}
        title="Confirm status update"
        message={
          <>
            Change status from <strong>{optimisticStatus}</strong> to{" "}
            <strong>{pendingStatus}</strong>?
          </>
        }
        onCancel={() => {
          setOpenConfirm(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmUpdate}
      />
    </>
  );
}
