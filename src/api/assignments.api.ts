import type { Assignment } from "../types/assignment";

const BASE_URL =  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface FetchAssignmentsParams {
  page?: number;
  perPage?: number;
  q?: string;
  statuses?: string[];
}

export async function fetchAssignments(params?: FetchAssignmentsParams): Promise<{data: Assignment[]; total: number}> {
  const search = new URLSearchParams();
  search.set("_page", String(params?.page || 1));
  // For json-server v1.x use _per_page instead of _limit
  search.set("_limit", String(params?.perPage || 20));

  if (params?.q) search.set("q", params.q);

  if (params?.statuses?.length) {
    params.statuses.forEach((s) => search.append("status", s));
  }

  const res = await fetch(`${BASE_URL}/assignments?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch assignments");
  return {
    data: await res.json(),
    total: Number(res.headers.get("X-Total-Count") || 0),
  };
}

export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    const res = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update assignment");
    return res.json();
}