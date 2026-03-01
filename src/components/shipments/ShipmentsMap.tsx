import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

import { RecenterMap } from "./RecenterMap";

// Fix leaflet marker icon (important when using Vite / CRA)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [30, 50],
  iconAnchor: [15, 50],
});

type Shipment = {
  id: string;
  lat?: number;
  lng?: number;
};

type Props = {
  shipments: Shipment[];
  selectedShipmentId?: string | null;
};

export function ShipmentsMap({ shipments, selectedShipmentId }: Props) {
  // Only keep shipments that have valid coordinates
  const points = useMemo(
    () =>
      shipments
        .filter((s) => typeof s.lat === "number" && typeof s.lng === "number")
        .map((s) => ({
          id: s.id,
          lat: s.lat as number,
          lng: s.lng as number,
        })),
    [shipments]
  );

  if (points.length === 0) {
    return (
      <div
        style={{
          height: 250,
          background: "#f3f4f6",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        No location data available
      </div>
    );
  }

  // Default center = first shipment
  const defaultCenter: [number, number] = [points[0].lat, points[0].lng];

  return (
    <div
      style={{
        height: 250,
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={p.id === selectedShipmentId ? selectedIcon : defaultIcon}
          />
        ))}

        {/* Connect all shipments */}
        {points.length > 1 && (
          <Polyline
            positions={points.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "#2563eb" }}
          />
        )}

        {/* Center to selected shipment */}
        <RecenterMap points={points} selectedShipmentId={selectedShipmentId} />
      </MapContainer>
    </div>
  );
}
