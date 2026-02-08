type Props = {
  value?: string;
  onChange: (value: string) => void;
  loading?: boolean;
};

function Spinner() {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        border: "2px solid #d1d5db",
        borderTopColor: "#6b7280",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

export function ShipmentSearch({ value, onChange, loading }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "360px",
        maxWidth: "100%",
        flexShrink: 0,
      }}
    >
      <input
        type="text"
        placeholder="Search by client or container label..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px", // space for icon
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          color: "#1f2937",
          outline: "none",
        }}
      />

      {/* RIGHT ICON */}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          color: "#6b7280",
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? (
          <Spinner />
        ) : value ? (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            style={{
              all: "unset",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
