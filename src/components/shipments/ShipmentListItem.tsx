import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_STYLES, STATUS_OPTIONS } from "@/constants/shipmentStatus";

type Props = {
  selected?: boolean;
};

export function ShipmentListItem({ selected }: Props) {
  const status = "IN_TRANSIT" as ShipmentStatus;
  const style = STATUS_STYLES[status];

  return (
    <div
      style={{
        padding: 12,
        marginBottom: 8,
        border: "1px solid #ddd",
        borderRadius: 6,
        background: selected ? "#f0f6ff" : "#fff",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14 }}>CLIENT NAME</div>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 12,
            border: `1px solid ${style.border}`,
            background: style.bg,
            color: style.color,
            fontWeight: 500,
          }}
        >
          {STATUS_OPTIONS.find((opt) => opt.value === status)?.label}
        </span>
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        CONTAINER LABEL · ARRIVAL DATE
      </div>
    </div>
  );
}
