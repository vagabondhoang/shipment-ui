import { ShipmentGroup } from "./ShipmentGroup";
import { AssignmentListItem } from "./AssignmentListItem";

import type { Assignment, AssignmentStatus } from "@/types/assignment";

interface AssignmentListPanelProps {
  grouped: {
    status: AssignmentStatus;
    items: Assignment[];
  }[];
  loading?: boolean;
  isPending?: boolean;
  error?: Error | null;
  onSelect: (id: string) => void;
  selectedId?: string | null;
}

export function AssignmentListPanel({
  grouped,
  isPending,
  error,
  onSelect,
  selectedId,
}: AssignmentListPanelProps) {
  if (error) {
    return (
      <aside style={{ padding: 16, color: "#b91c1c" }}>
        Failed to load assignments: {error.message}
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
          {items.map((assignment) => (
            <AssignmentListItem
              key={assignment.id}
              assignment={assignment}
              selected={assignment.id === selectedId}
              onSelect={() => onSelect(assignment.id)}
              data-assignment-item={assignment.id}
            />
          ))}
        </ShipmentGroup>
      ))}
    </aside>
  );
}
