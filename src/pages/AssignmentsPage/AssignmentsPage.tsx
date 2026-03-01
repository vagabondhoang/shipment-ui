import { useState, useMemo, useEffect, useLayoutEffect } from "react";

import { AssignmentListPanel } from "@/components/assignments";
import { Toolbar } from "@/components/common/Toolbar";
import { ShipmentDetailsPanel } from "@/components/shipments";
import { fetchShipmentsByAssignment } from "@/api/shipments.api";

import { readShipmentQuery, writeShipmentQuery } from "@/utils/query";
import type { AssignmentStatus } from "@/types/assignment";
import { useAssignments } from "@/hooks/useAssignments";
import { groupAssignmentsByStatus } from "@/utils/assignment";

import { useScrollAnchor } from "@/hooks/useScrollAnchor";
import { AssignmentDetails } from "@/components/assignments";
import type { Shipment } from "@/types/shipment";
import { ShipmentsMap } from "@/components/shipments/ShipmentsMap";

export const AssignmentsPage = () => {
  const initial = readShipmentQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus[]>(
    initial.statuses || []
  );

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  const [openModal, setOpenModal] = useState(false);

  const {
    search,
    setSearch,
    assignments,
    loading,
    isPending,
    error,
    deleteAssignmentOptimistic,
    loadMore,
    hasMore,
    loadingSource,
    setLoadingSource,
    refetchAssignments,
  } = useAssignments(statusFilter);

  const { listRef, saveAnchor, restoreAnchor } = useScrollAnchor();

  const [allShipments, setAllShipments] = useState<Shipment[]>([]);

  const grouped = useMemo(
    () => groupAssignmentsByStatus(assignments),
    [assignments]
  );

  const selectedAssignment = useMemo(() => {
    if (selectedId) {
      return assignments.find((s) => s.id === selectedId) ?? null;
    }

    const firstGroup = grouped.find((g) => g.items.length > 0);
    return firstGroup?.items[0] ?? null;
  }, [grouped, assignments, selectedId]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter([]);
    setLoadingSource(null);
  };

  const handleStatusFilterChange = (next: AssignmentStatus[]) => {
    setLoadingSource("filter");
    setStatusFilter(next);
  };

  const handleLoadMore = () => {
    saveAnchor("[data-assignment-item]", "assignmentItem");

    loadMore();
  };

  useLayoutEffect(() => {
    // restoreAnchor();
  }, [assignments, restoreAnchor]);

  useEffect(() => {
    writeShipmentQuery(search, statusFilter);
  }, [search, statusFilter]);

  const handleSelectAssignment = (id: string) => {
    setSelectedId(id);
    setSelectedShipment(null);
  };

  function handleFetchShipmentsForAssignment(assignmentId: string) {
    fetchShipmentsByAssignment(assignmentId).then(setAllShipments);
  }

  useEffect(() => {
    if (!selectedAssignment?.id) return;
    handleFetchShipmentsForAssignment(selectedAssignment.id);
  }, [selectedAssignment?.id]);

  return (
    <div style={{ padding: 16, paddingTop: 0 }}>
      <Toolbar
        searchText={search}
        onSearchTextChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onClear={handleClearFilters}
        loading={loadingSource === "search" && loading}
        placeholder="Search by assignment label..."
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
        Create Assignment
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) 1fr 1fr",
          gap: 8,
          marginTop: 8,
          alignItems: "start",
        }}
      >
        {/* ASSIGNMENT LIST */}
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
          <AssignmentListPanel
            grouped={grouped}
            isPending={isPending || loading}
            error={error}
            onSelect={handleSelectAssignment}
            selectedId={selectedAssignment?.id ?? null}
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
        {/* Assignment detail PANEL */}
        {selectedAssignment ? (
          <div
            style={{
              alignSelf: "start",
            }}
          >
            <AssignmentDetails
              assignment={selectedAssignment}
              selectedShipment={selectedShipment as Shipment}
              onSelect={setSelectedShipment}
              deleteAssignmentOptimistic={deleteAssignmentOptimistic}
              shipments={allShipments}
            />
          </div>
        ) : (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
              background: "#f9fafb",
              color: "#6b7280",
            }}
          >
            No assignment selected
          </div>
        )}
        {/* Shipment detail PANEL */}
        {selectedShipment ? (
          <div
            style={{
              alignSelf: "start",
            }}
          >
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
                hideMap
                refetch={(assignmentChanged) => {
                  refetchAssignments();
                  if (selectedAssignment?.id) {
                    handleFetchShipmentsForAssignment(selectedAssignment.id);
                  }
                  if (assignmentChanged) {
                    setSelectedShipment(null);
                  }
                }}
              />
              {/* Assignment-specific map */}
              <ShipmentsMap
                shipments={allShipments}
                selectedShipmentId={selectedShipment.id}
              />
            </section>
          </div>
        ) : (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
              background: "#f9fafb",
              color: "#6b7280",
            }}
          >
            No shipment selected
          </div>
        )}
      </div>
    </div>
  );
};
