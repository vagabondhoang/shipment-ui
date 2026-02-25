import { useEffect, useState, useTransition, useCallback } from "react";
import { fetchShipments } from "../api/shipments.api";
import type { Shipment, ShipmentStatus } from "@/types/shipment";
import { useDebounce } from "./useDebounce";

import { ensureMinDelay } from "@/utils/ensureMinDelay";
import { MIN_LOADING_TIME, PAGE_SIZE } from "@/constants/shipmentStatus";

import { readShipmentQuery } from "@/utils/query";



interface UseShipmentsResult {
  shipments: Shipment[];
  loading: boolean;
  isPending: boolean;
  error: Error | null;

  search: string;
  setSearch: (v: string) => void;

  loadMore: () => void;
  hasMore: boolean;

  updateShipmentOptimistic: (id: string, data: Partial<Shipment>) => void;
  refetchShipments: () => void;

  loadingSource?: "search" | "filter" | null;
  setLoadingSource: (source: "search" | "filter" | null) => void;

}

export function useShipments(statusFilter: ShipmentStatus[]): UseShipmentsResult {
  const initial = readShipmentQuery();

  const [search, setSearchRaw] = useState(initial.q || "");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingSource, setLoadingSource] = useState<
    "search" | "filter" | null
  >(null);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 400);

  const setSearch = (value: string) => {
    setSearchRaw(value);
    setPage(1);  
    if(loadingSource !== 'search') {
      setLoadingSource('search');
    }
  };

  // Fetch shipments
  useEffect(() => {
  let cancelled = false;

  async function run() {
    const start = Date.now();
    setLoading(true);
    setError(null);

    try {
      const { data, total } = await fetchShipments({
        page,
        perPage: PAGE_SIZE,
        q: debouncedSearch || undefined,
        statuses: statusFilter.length ? statusFilter : undefined,
      });

      //Because mock APIs respond instantly, I added a minimum loading duration to avoid make loading states perceptible.
      await ensureMinDelay(start, MIN_LOADING_TIME);
      if (cancelled) return;

      setTotal(total);
      setShipments((prev) =>
        page === 1 ? data : [...prev, ...data]
      );
    } catch (e) {
      if (!cancelled) setError(e as Error);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  run();

  return () => {
    cancelled = true;
  };
}, [page, debouncedSearch, statusFilter]);

const updateShipmentOptimistic = useCallback(
    (id: string, data: Partial<Shipment>) => {
      setShipments((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...data } : s
        )
      );
    },
    []
  );

  const refetchShipments = useCallback(() => {
    startTransition(() => {
      setPage(1);
      setShipments([]);
    });
  }, []);

  const hasMore = shipments.length < total;

  const loadMore = () => {
    if (!loading && hasMore) {
    startTransition(() => {
        setPage((p) => p + 1);
    });
    }
  };

  return {
    shipments,
    loading,
    isPending,
    error,

    search,
    setSearch,
    loadingSource,
    setLoadingSource,

    loadMore,
    hasMore,

    updateShipmentOptimistic,
    refetchShipments,
  };
}
