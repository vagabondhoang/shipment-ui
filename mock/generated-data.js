import fs from "fs";
const statusList = ["OPEN", "IN_TRANSIT", "DELIVERED"];
const statuses = statusList.map((status) => ({ id: status }));
const clients = [
  "Sony",
  "Samsung",
  "DHL",
  "CargoTrans",
  "ShipCo",
  "Logix",
  "Oceanic",
];
const warehouses = ["EWR", "LAX", "JFK", "SFO", "SEA"];
const baseDate = new Date();
const minLat = 32.55;
const maxLat = 33.05;
const minLng = -97.4;
const maxLng = -96.5;
const shipments = [];
const assignments = [];

for (let j = 1; j <= 15; j++) {
  assignments.push({
    id: `as_${String(j).padStart(3, "0")}`,
    label: `TX-${120 + j}`,
    status: j <= 3 ? "OPEN" : statusList[j % statusList.length],
    clients: [],
    shipment_count: 1,
  });
}
for (let i = 1; i <= 100; i++) {
  const arrival = new Date(baseDate);
  arrival.setDate(arrival.getDate() - Math.floor(Math.random() * 10));
  const eta = new Date(arrival);
  eta.setHours(eta.getHours() + Math.floor(Math.random() * 48));

  const currentStatus = statusList[i % statusList.length];

  let assignedId = null;
  if (currentStatus !== "OPEN") {
    assignedId = assignments[Math.floor(Math.random() * assignments.length)].id;
  }

  shipments.push({
    id: `shp_${String(i).padStart(3, "0")}`,
    client_name: clients[i % clients.length],
    container_label: `${warehouses[i % warehouses.length]}-581-2505${
      20 + (i % 10)
    }-${i}`,
    status: currentStatus,
    assignment_id: assignedId,
    arrival_date: arrival.toISOString(),
    delivery_by_date: new Date(arrival.getTime() + 2 * 86400000).toISOString(),
    eta: eta.toISOString(),
    warehouse_id: "581",
    lat: Math.random() * (maxLat - minLat) + minLat,
    lng: Math.random() * (maxLng - minLng) + minLng,
  });
}

assignments.forEach((as) => {
  const relatedShipments = shipments.filter((s) => s.assignment_id === as.id);
  as.shipment_count = relatedShipments.length;
  as.clients = [...new Set(relatedShipments.map((s) => s.client_name))];

  if (as.shipment_count > 0) {
    as.status = "IN_TRANSIT";
  }
});

const result = {
  statuses: statuses,
  shipments: shipments,
  assignments: assignments,
};
fs.writeFileSync(
  new URL("./shipments.json", import.meta.url),
  JSON.stringify(result, null, 2)
);
console.log("✅ shipment data generated with compatible status objects");
