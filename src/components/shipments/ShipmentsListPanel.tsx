import { ShipmentGroup } from "./ShipmentGroup";
import { ShipmentListItem } from "./ShipmentListItem";

import type { Shipment, ShipmentStatus } from "@/types/shipment";

interface ShipmentsListPanelProps {
  grouped: {
    status: ShipmentStatus;
    items: Shipment[];
  }[];
  loading?: boolean;
  isPending?: boolean;
  error?: Error | null;
  onSelect: (id: string) => void;
  selectedId?: string | null;
}

export function ShipmentsListPanel({
  grouped,
  loading,
  isPending,
  error,
  onSelect,
  selectedId,
}: ShipmentsListPanelProps) {
  if (error) {
    return (
      <aside style={{ padding: 16, color: "#b91c1c" }}>
        Failed to load shipments
      </aside>
    );
  }

  return (
    <aside
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 8,
        background: "#fff",
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 150ms ease",
      }}
    >
      {grouped.map(({ status, items }) => (
        <ShipmentGroup key={status} title={status} count={items.length}>
          {items.map((shipment) => (
            <ShipmentListItem
              key={shipment.id}
              shipment={shipment}
              selected={shipment.id === selectedId}
              onSelect={() => onSelect(shipment.id)}
              data-shipment-item={shipment.id}
            />
          ))}
        </ShipmentGroup>
      ))}
    </aside>
  );
}
