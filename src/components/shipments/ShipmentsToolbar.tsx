import { ShipmentStatusFilter } from "./ShipmentStatusFilter";
import type { ShipmentStatus } from "@/types/shipment";

interface ShipmentsToolbarProps {
  searchText?: string;
  onSearchTextChange: (value: string) => void;

  statusFilter: ShipmentStatus[];
  onStatusFilterChange: (next: ShipmentStatus[]) => void;

  onClear: () => void;
}

export const ShipmentsToolbar: React.FC<ShipmentsToolbarProps> = ({
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search shipments…"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        style={{
          width: "50%",
          maxWidth: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          color: "#1f2937",
        }}
      />

      {/* Status filter */}
      <ShipmentStatusFilter
        value={statusFilter}
        onChange={onStatusFilterChange}
      />

      {/* Clear */}
      <button
        onClick={onClear}
        style={{
          height: 32,
          padding: "0 16px",
          borderRadius: 8,
          border: "1px solid #fca5a5",
          background: "#fff",
          color: "#b91c1c",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        CLEAR
      </button>
    </div>
  );
};
