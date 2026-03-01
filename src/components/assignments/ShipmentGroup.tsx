import type { ReactNode } from "react";

type Props = {
  title: string;
  count: number;
  children: ReactNode;
};

export function ShipmentGroup({ title, count, children }: Props) {
  return (
    <section style={{ marginBottom: 16 }}>
      <div
        style={{
          padding: "6px 8px",
          borderBottom: "1px solid #ccc",
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 13,
          textTransform: "uppercase",
          color: "#333",
        }}
      >
        {title} – {count} items
      </div>

      {children}
    </section>
  );
}
