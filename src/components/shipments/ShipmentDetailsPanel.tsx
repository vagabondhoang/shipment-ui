import { useState } from "react";
import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";

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

export function ShipmentDetailsPanel() {
  const [status, setStatus] = useState<ShipmentStatus>("OPEN");
  const [pendingStatus, setPendingStatus] = useState<ShipmentStatus | null>(
    null
  );

  const [openConfirm, setOpenConfirm] = useState(false);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPendingStatus(e.target.value as ShipmentStatus);
    setOpenConfirm(true);
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

        <DetailRow label="Client">CLIENT NAME</DetailRow>

        <DetailRow label="Container Label">LAX-581-XXXXX</DetailRow>

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

        <DetailRow label="Arrival Date">2025-05-28</DetailRow>
        <DetailRow label="Delivery By">2025-05-30</DetailRow>
        <DetailRow label="Warehouse">581</DetailRow>
      </section>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={openConfirm}
        title="Confirm status update"
        message={
          <>
            Change status from <strong>{status}</strong> to{" "}
            <strong>{pendingStatus}</strong>?
          </>
        }
        onCancel={() => {
          setOpenConfirm(false);
          setPendingStatus(null);
        }}
        onConfirm={() => {
          // TODO: call update API
          setStatus(pendingStatus!);
          setOpenConfirm(false);
        }}
      />
    </>
  );
}
