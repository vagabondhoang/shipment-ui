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
      role="status"
      aria-label="Loading"
    />
  );
}

export function ShipmentSearch({ value, onChange, loading }: Props) {
  return (
    <form
      style={{
        position: "relative",
      }}
      role="search"
      onSubmit={(e) => e.preventDefault()} // Prevent form submission
    >
      <label htmlFor="shipment-search" style={{ display: "none" }}>
        Search Shipments
      </label>
      <input
        id="shipment-search"
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
        aria-busy={loading || undefined}
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
            type="button"
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
    </form>
  );
}
