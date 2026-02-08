import { STATUS_STYLES, STATUS_OPTIONS } from "@/constants/shipmentStatus";

import type { Shipment } from "@/types/shipment";

type Props = {
  shipment: Shipment;
  selected?: boolean;
  onSelect: (id: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function ShipmentListItem({
  shipment,
  selected,
  onSelect,
  ...rest
}: Props) {
  const style = STATUS_STYLES[shipment.status];

  return (
    <div
      {...rest}
      style={{
        padding: 12,
        marginBottom: 8,
        border: "1px solid #ddd",
        borderRadius: 6,
        background: selected ? "#f0f6ff" : "#fff",
        cursor: "pointer",
      }}
      onClick={() => onSelect(shipment.id)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div style={{ fontWeight: 500 }}>{shipment?.client_name}</div>
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
          {STATUS_OPTIONS.find((opt) => opt.value === shipment?.status)?.label}
        </span>
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        {shipment.container_label} ·{" "}
        {new Date(shipment.arrival_date).toLocaleDateString()}
      </div>
    </div>
  );
}
