import { useEffect } from "react";
import { useMap } from "react-leaflet";
type Point = {
  id: string;
  lat: number;
  lng: number;
};

export function RecenterMap({
  points,
  selectedShipmentId,
}: {
  points: Point[];
  selectedShipmentId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    // If a shipment is selected → center to it
    if (selectedShipmentId) {
      const selected = points.find((p) => p.id === selectedShipmentId);
      if (selected) {
        map.setView([selected.lat, selected.lng], 8, {
          animate: true,
        });
        return;
      }
    }

    // Otherwise fit all shipments
    if (points.length > 1) {
      const bounds = points.map((p) => [p.lat, p.lng]) as [number, number][];
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points, selectedShipmentId]);

  return null;
}
