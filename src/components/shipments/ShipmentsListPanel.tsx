import { ShipmentGroup } from "./ShipmentGroup";
import { ShipmentListItem } from "./ShipmentListItem";

export function ShipmentsListPanel() {
  return (
    <aside style={{ border: "1px solid #ddd", padding: 8 }}>
      <ShipmentGroup title="OPEN" count={2}>
        <ShipmentListItem selected />
        <ShipmentListItem />
      </ShipmentGroup>

      <ShipmentGroup title="IN_TRANSIT" count={2}>
        <ShipmentListItem />
        <ShipmentListItem />
      </ShipmentGroup>

      <ShipmentGroup title="DELIVERED" count={1}>
        <ShipmentListItem />
      </ShipmentGroup>
    </aside>
  );
}
