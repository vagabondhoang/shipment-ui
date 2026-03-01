import { useEffect, useState, useTransition, useCallback } from "react";
import { fetchAssignments } from "../api/assignments.api";
import { useDebounce } from "./useDebounce";

import { ensureMinDelay } from "@/utils/ensureMinDelay";
import { MIN_LOADING_TIME, PAGE_SIZE } from "@/constants/shipmentStatus";

import { readShipmentQuery } from "@/utils/query";
import type { Assignment, AssignmentStatus } from "@/types/assignment";

interface UseAssignmentsResult {
  assignments: Assignment[];
  loading: boolean;
  isPending: boolean;
  error: Error | null;

  search: string;
  setSearch: (v: string) => void;

  loadMore: () => void;
  hasMore: boolean;

  updateAssignmentOptimistic: (id: string, data: Partial<Assignment>) => void;
  deleteAssignmentOptimistic: (id: string) => void;
  addAssignmentOptimistic: (assignment: Assignment) => void;
  refetchAssignments: () => void;

  loadingSource?: "search" | "filter" | null;
  setLoadingSource: (source: "search" | "filter" | null) => void;

}

export function useAssignments(statusFilter: AssignmentStatus[]): UseAssignmentsResult {
  const initial = readShipmentQuery();

  const [search, setSearchRaw] = useState(initial.q || "");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingSource, setLoadingSource] = useState<
    "search" | "filter" | null
  >(null);

  const [refetchIndex, setRefetchIndex] = useState(0);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 400);

  const setSearch = (value: string) => {
    setSearchRaw(value);
    setPage(1);  
    if(loadingSource !== 'search') {
      setLoadingSource('search');
    }
  };


  // Fetch Assignments
  useEffect(() => {
  let cancelled = false;

  async function run() {
    const start = Date.now();
    setLoading(true);
    setError(null);

    try {
      const { data, total } = await fetchAssignments({
        page,
        perPage: PAGE_SIZE,
        q: debouncedSearch || undefined,
        statuses: statusFilter.length ? statusFilter : undefined,
      });

      //Because mock APIs respond instantly, I added a minimum loading duration to avoid make loading states perceptible.
      await ensureMinDelay(start, MIN_LOADING_TIME);
      if (cancelled) return;

      setTotal(total);
      setAssignments((prev) =>
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
}, [page, debouncedSearch, statusFilter, refetchIndex]);

const updateAssignmentOptimistic = useCallback(
    (id: string, data: Partial<Assignment>) => {
      setAssignments((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...data } : s
        )
      );
    },
    []
  );

  const deleteAssignmentOptimistic = useCallback((id: string) => {
    setAssignments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addAssignmentOptimistic = useCallback((assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  }, []);

  const refetchAssignments = useCallback(() => {
    startTransition(() => {
      setRefetchIndex((i) => i + 1);
    });
  }, []);

  const hasMore = assignments.length < total;

  const loadMore = () => {
    if (!loading && hasMore) {
    startTransition(() => {
        setPage((p) => p + 1);
    });
    }
  };

  return {
    assignments,
    loading,
    isPending,
    error,

    search,
    setSearch,
    loadingSource,
    setLoadingSource,

    loadMore,
    hasMore,

    updateAssignmentOptimistic,
    deleteAssignmentOptimistic,
    addAssignmentOptimistic,
    refetchAssignments,
  };
}
