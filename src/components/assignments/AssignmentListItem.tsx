import { STATUS_STYLES, STATUS_OPTIONS } from "@/constants/shipmentStatus";

import type { Assignment } from "@/types/assignment";

type Props = {
  assignment: Assignment;
  selected?: boolean;
  onSelect: (id: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function AssignmentListItem({
  assignment,
  selected,
  onSelect,
  ...rest
}: Props) {
  const style = STATUS_STYLES[assignment.status];

  return (
    <article
      {...rest}
      style={{
        padding: 12,
        marginBottom: 8,
        border: "1px solid #ddd",
        borderRadius: 6,
        background: selected ? "#f0f6ff" : "#fff",
        cursor: "pointer",
      }}
      onClick={() => onSelect(assignment.id)}
      role="button"
      tabIndex={0}
      aria-selected={selected}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <h2 style={{ fontWeight: 500, fontSize: "1rem", margin: 0 }}>
          {assignment?.label}
        </h2>
        <span
          style={{
            fontSize: "0.75rem",
            padding: "2px 8px",
            borderRadius: 12,
            border: `1px solid ${style.border}`,
            background: style.bg,
            color: style.color,
            fontWeight: 500,
          }}
        >
          {
            STATUS_OPTIONS.find((opt) => opt.value === assignment?.status)
              ?.label
          }
        </span>
      </header>

      <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>
        {assignment?.clients?.join(", ")}
      </p>
    </article>
  );
}
