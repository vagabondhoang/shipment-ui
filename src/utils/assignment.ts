import type { Assignment, AssignmentStatus } from "@/types/assignment";

const STATUS_ORDER: AssignmentStatus[] = [
  "OPEN",
  "IN_TRANSIT",
  "DELIVERED",
];

export function groupAssignmentsByStatus(assignments: Assignment[]) {
  const map: Record<AssignmentStatus, Assignment[]> = {
    OPEN: [],
    IN_TRANSIT: [],
    DELIVERED: [],
  };

  for (const s of assignments) {
    map[s.status].push(s);
  }

  return STATUS_ORDER.map((status) => ({
    status,
    items: map[status],
  }));
}




