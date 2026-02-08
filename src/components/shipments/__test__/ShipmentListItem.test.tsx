import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ShipmentListItem } from "../ShipmentListItem";
import type { Shipment } from "@/types/shipment";

const mockShipment: Shipment = {
  id: "s1",
  client_name: "Samsung",
  container_label: "LAX-581-250526-36",
  arrival_date: "2026-01-31T04:34:29.342Z",
  status: "OPEN",
  delivery_by_date: "2026-02-02T04:34:29.342Z",
  eta: "2026-02-01T20:34:29.342Z",
  warehouse_id: "581",
};

describe("ShipmentListItem", () => {
  it("renders shipment information", () => {
    render(<ShipmentListItem shipment={mockShipment} onSelect={vi.fn()} />);

    // client name
    expect(
      screen.getByRole("heading", { name: /samsung/i })
    ).toBeInTheDocument();

    // status label
    expect(screen.getByText(/open/i)).toBeInTheDocument();

    // container label + date
    expect(screen.getByText(/lax-581-250526-36/i)).toBeInTheDocument();
  });

  it("calls onSelect with shipment id when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<ShipmentListItem shipment={mockShipment} onSelect={onSelect} />);

    const item = screen.getByRole("button");

    await user.click(item);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("s1");
  });

  it("sets aria-selected when selected", () => {
    render(
      <ShipmentListItem shipment={mockShipment} selected onSelect={vi.fn()} />
    );

    const item = screen.getByRole("button");

    expect(item).toHaveAttribute("aria-selected", "true");
  });

  it("is focusable for keyboard navigation (a11y)", async () => {
    const user = userEvent.setup();

    render(<ShipmentListItem shipment={mockShipment} onSelect={vi.fn()} />);

    const item = screen.getByRole("button");

    await user.tab();

    expect(item).toHaveFocus();
  });
});
