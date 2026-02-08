import type { ShipmentStatus } from "@/types/shipment";

import { ShipmentStatusFilter } from "./ShipmentStatusFilter";
import { ShipmentSearch } from "./ShipmentSearch";

import "./shipment.css";

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
    <div className="shipments-toolbar">
      {/* Search */}
      <div>
        <ShipmentSearch
          value={searchText}
          onChange={onSearchTextChange}
          loading={loading}
        />
      </div>

      {/* Status filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
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
