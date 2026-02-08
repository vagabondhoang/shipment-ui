import type { ShipmentStatus } from "@/types/shipment";

import { ShipmentStatusFilter } from "./ShipmentStatusFilter";
import { ShipmentSearch } from "./ShipmentSearch";

interface ShipmentsToolbarProps {
  searchText?: string;
  onSearchTextChange: (value: string) => void;

  statusFilter: ShipmentStatus[];
  onStatusFilterChange: (next: ShipmentStatus[]) => void;

  onClear: () => void;
  loading?: boolean;
}

export const ShipmentsToolbar: React.FC<ShipmentsToolbarProps> = ({
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
  loading,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "360px 2fr",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {/* Search */}
      <div>
        <ShipmentSearch
          value={searchText}
          onChange={onSearchTextChange}
          loading={loading}
        />
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
    </div>
  );
};
