import toast from "react-hot-toast";
import { createShipment } from "@/api/shipments.api";
import "./CreateShipmentForm.css";
import type { Shipment } from "@/types/shipment";

export function CreateShipmentForm({
  onSuccess,
}: {
  onSuccess: (shipment?: Shipment) => void;
}) {
  // NOTE:
  // Date validation (delivery_by_date >= arrival_date) should be handled here.
  // Skipped in this demo due to time constraints, as focus is on core shipment
  // and assignment flows per requirements.

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const createdShipment = await createShipment({
        client_name: formData.get("client_name") as string,
        container_label: formData.get("label") as string,
        arrival_date: new Date(
          formData.get("arrival_date") as string
        ).toISOString(),
        delivery_by_date: new Date(
          formData.get("delivery_by_date") as string
        ).toISOString(),
        lat: Number(formData.get("lat")),
        lng: Number(formData.get("lng")),
        status: "OPEN",
        assignment_id: null,
        warehouse_id: "581",
      });
      toast.success("Shipment created successfully!");

      onSuccess(createdShipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment. Please try again.");
    }
  }

  return (
    <form id="create-shipment-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="client_name">Client Name</label>
          <input id="client_name" name="client_name" type="text" required />
        </div>

        <div className="form-field">
          <label htmlFor="label">Container Label</label>
          <input id="label" name="label" type="text" required />
        </div>

        <div className="form-field">
          <label htmlFor="arrival_date">Arrival Date</label>
          <input id="arrival_date" name="arrival_date" type="date" required />
        </div>

        <div className="form-field">
          <label htmlFor="delivery_by_date">Delivery By</label>
          <input
            id="delivery_by_date"
            name="delivery_by_date"
            type="date"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="lat">Latitude</label>
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            required
            min={32.55}
            max={33.05}
          />
        </div>

        <div className="form-field">
          <label htmlFor="lng">Longitude</label>
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            required
            min={-97.4}
            max={-96.5}
          />
        </div>
      </div>
    </form>
  );
}
