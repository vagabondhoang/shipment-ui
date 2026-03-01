import type { ShipmentStatus } from "@/types/shipment";

import { ShipmentStatusFilter } from "../shipments/ShipmentStatusFilter";
import { SearchInput } from "./SearchInput";

import "./toolbar.css";

interface ToolbarProps {
  searchText?: string;
  onSearchTextChange: (value: string) => void;

  statusFilter: ShipmentStatus[];
  onStatusFilterChange: (next: ShipmentStatus[]) => void;

  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
  loading,
  placeholder,
}) => {
  return (
    <div className="toolbar">
      {/* Search */}
      <div>
        <SearchInput
          value={searchText}
          onChange={onSearchTextChange}
          loading={loading}
          placeholder={placeholder}
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
