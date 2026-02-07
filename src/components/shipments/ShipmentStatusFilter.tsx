import type { ShipmentStatus } from "@/types/shipment";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";

interface ShipmentStatusFilterProps {
  value: ShipmentStatus[];
  onChange: (next: ShipmentStatus[]) => void;
}

export const ShipmentStatusFilter: React.FC<ShipmentStatusFilterProps> = ({
  value,
  onChange,
}) => {
  const toggleStatus = (status: ShipmentStatus) => {
    if (value.includes(status)) {
      onChange(value.filter((s) => s !== status));
    } else {
      onChange([...value, status]);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#1f2937",
        }}
      >
        Status
      </span>

      {STATUS_OPTIONS.map((option) => {
        const active = value.includes(option.value);

        return (
          <button
            key={option.value}
            onClick={() => toggleStatus(option.value)}
            style={{
              height: 32,
              padding: "0 14px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: active ? "#eef2ff" : "#fff",
              color: "#1f2937",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
