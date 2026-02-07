import { useState } from "react";

import {
  ShipmentsToolbar,
  ShipmentsListPanel,
  ShipmentDetailsPanel,
} from "@/components/shipments";
import type { ShipmentStatus } from "@/types/shipment";

export function ShipmentsPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>([]);

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter([]);
  };

  return (
    <div style={{ padding: 16 }}>
      <ShipmentsToolbar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClear={handleClearFilters}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <ShipmentsListPanel />
        <ShipmentDetailsPanel />
      </div>
    </div>
  );
}
