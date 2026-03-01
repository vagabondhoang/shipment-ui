import { useState, useMemo, useEffect, useLayoutEffect } from "react";

import {
  ShipmentsListPanel,
  ShipmentDetailsPanel,
} from "@/components/shipments";
import type { ShipmentStatus } from "@/types/shipment";

import { useShipments } from "@/hooks/useShipments";
import { groupShipmentsByStatus } from "@/utils/shipment";
import { readShipmentQuery, writeShipmentQuery } from "@/utils/query";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CreateShipmentForm } from "@/components/shipments/CreateShipmentForm";
import { Toolbar } from "@/components/common/Toolbar";

import { useScrollAnchor } from "@/hooks/useScrollAnchor";

export function ShipmentsPage() {
  const initial = readShipmentQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>(
    initial.statuses || []
  );

  const [openModal, setOpenModal] = useState(false);

  const {
    search,
    setSearch,
    shipments,
    loading,
    isPending,
    error,
    loadMore,
    hasMore,
    loadingSource,
    setLoadingSource,
    refetchShipments,
  } = useShipments(statusFilter);

  const { listRef, saveAnchor, restoreAnchor } = useScrollAnchor();

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
    setLoadingSource(null);
  };
  const handleStatusFilterChange = (next: ShipmentStatus[]) => {
    setLoadingSource("filter");
    setStatusFilter(next);
  };

  const handleLoadMore = () => {
    saveAnchor("[data-shipment-item]", "shipmentItem");

    loadMore();
  };

  useLayoutEffect(() => {
    restoreAnchor();
  }, [shipments, restoreAnchor]);

  useEffect(() => {
    writeShipmentQuery(search, statusFilter);
  }, [search, statusFilter]);

  return (
    <div style={{ padding: 16, paddingTop: 0 }}>
      <Toolbar
        searchText={search}
        onSearchTextChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onClear={handleClearFilters}
        loading={loadingSource === "search" && loading}
        placeholder="Search by client or container label..."
      />
      <button
        style={{
          marginTop: 8,
          border: "1px solid #1d4ed8",
          color: "#1d4ed8",
          background: "transparent",
          padding: "8px 12px",
          borderRadius: 4,
          cursor: "pointer",
        }}
        onClick={() => setOpenModal(true)}
      >
        Create Shipment
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) 2fr",
          gap: 8,
          marginTop: 8,
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}
        <div
          ref={listRef}
          style={{
            maxHeight: "calc(100vh - 180px)",
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
            isPending={isPending || loading}
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
            <section
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                background: "#fff",
                maxHeight: "calc(100vh - 180px)",
                overflowY: "auto",
              }}
            >
              <ShipmentDetailsPanel
                shipment={selectedShipment}
                onSelect={setSelectedId}
                refetch={refetchShipments}
              />
            </section>
          </div>
        ) : (
          <section
            style={{
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
            }}
            aria-label="Shipment details placeholder"
          >
            <p>Please select a shipment to see the details.</p>
          </section>
        )}
      </div>
      <ConfirmDialog
        open={openModal}
        title="Create Shipment"
        onCancel={() => setOpenModal(false)}
        submitFormId="create-shipment-form"
      >
        <CreateShipmentForm
          onSuccess={(shipment) => {
            setOpenModal(false);
            if (shipment) {
              // Instead of adding optimistically, we refetch to get the new shipment with all details
              refetchShipments();
            }
          }}
        />
      </ConfirmDialog>
    </div>
  );
}
