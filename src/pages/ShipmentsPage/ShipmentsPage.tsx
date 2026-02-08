import { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";

import {
  ShipmentsToolbar,
  ShipmentsListPanel,
  ShipmentDetailsPanel,
} from "@/components/shipments";
import type { ShipmentStatus } from "@/types/shipment";

import { useShipments } from "@/hooks/useShipments";
import { groupShipmentsByStatus } from "@/utils/shipment";

export function ShipmentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>([]);

  const listRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<{ id: string; offset: number } | null>(null);

  const {
    search,
    setSearch,
    shipments,
    loading,
    isPending,
    error,
    loadMore,
    hasMore,
    updateShipmentOptimistic,
  } = useShipments();

  console.log({ loading });

  const grouped = useMemo(() => groupShipmentsByStatus(shipments), [shipments]);

  const selectedShipment = useMemo(() => {
    if (selectedId) {
      return shipments.find((s) => s.id === selectedId) ?? null;
    }

    const firstGroup = grouped.find((g) => g.items.length > 0);
    return firstGroup?.items[0] ?? null;
  }, [grouped, shipments, selectedId]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter([]);
  };

  // 🔹 SAVE ANCHOR BEFORE LOAD MORE
  const handleLoadMore = () => {
    if (!listRef.current) return;

    const items = listRef.current.querySelectorAll<HTMLElement>(
      "[data-shipment-item]"
    );

    const lastItem = items[items.length - 1];
    if (lastItem) {
      anchorRef.current = {
        id: lastItem.dataset.shipmentItem!,
        offset: lastItem.getBoundingClientRect().top,
      };
    }

    loadMore();
  };

  // 🔹 RESTORE SCROLL AFTER DATA APPEND
  useLayoutEffect(() => {
    if (!listRef.current || !anchorRef.current) return;

    const el = listRef.current.querySelector<HTMLElement>(
      `[data-shipment-item="${anchorRef.current.id}"]`
    );

    if (!el) return;

    const newOffset = el.getBoundingClientRect().top;
    const delta = newOffset - anchorRef.current.offset;

    listRef.current.scrollTop += delta;

    anchorRef.current = null;
  }, [shipments]);

  return (
    <div style={{ padding: 16 }}>
      <ShipmentsToolbar
        searchText={search}
        onSearchTextChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClear={handleClearFilters}
        loading={loading}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 2fr",
          gap: 16,
          marginTop: 16,
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}
        <div
          ref={listRef}
          style={{
            maxHeight: "calc(100vh - 140px)",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            position: "relative",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 150ms ease",
          }}
        >
          <ShipmentsListPanel
            grouped={grouped}
            loading={loading}
            isPending={isPending}
            error={error}
            onSelect={setSelectedId}
            selectedId={selectedShipment?.id ?? null}
          />

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderTop: "1px solid #e5e7eb",
                background: "#fff",
                position: "sticky",
                bottom: 0,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          )}

          {(loading || isPending) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.4)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* RIGHT PANEL */}
        {selectedShipment ? (
          <div style={{ alignSelf: "start" }}>
            <ShipmentDetailsPanel
              shipment={selectedShipment}
              onOptimisticUpdate={updateShipmentOptimistic}
              onSelect={setSelectedId}
            />
          </div>
        ) : (
          <div
            style={{
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
            }}
          >
            Please select a shipment to see the details.
          </div>
        )}
      </div>
    </div>
  );
}
