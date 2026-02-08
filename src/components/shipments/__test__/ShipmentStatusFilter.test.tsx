import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShipmentStatusFilter } from "../ShipmentStatusFilter";
import { STATUS_OPTIONS } from "@/constants/shipmentStatus";
import type { ShipmentStatus } from "@/types/shipment";

describe("ShipmentStatusFilter", () => {
  it("renders status label and all status options", () => {
    render(<ShipmentStatusFilter value={[]} onChange={vi.fn()} />);

    // Title
    expect(screen.getByText("Status")).toBeInTheDocument();

    // All status buttons
    STATUS_OPTIONS.forEach((opt) => {
      expect(
        screen.getByRole("button", { name: opt.label })
      ).toBeInTheDocument();
    });
  });

  it("adds status when clicking inactive option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ShipmentStatusFilter value={[]} onChange={onChange} />);

    const firstStatus = STATUS_OPTIONS[0];

    await user.click(screen.getByRole("button", { name: firstStatus.label }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([firstStatus.value]);
  });

  it("removes status when clicking active option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const activeValue: ShipmentStatus[] = [
      STATUS_OPTIONS[0].value,
      STATUS_OPTIONS[1].value,
    ];

    render(<ShipmentStatusFilter value={activeValue} onChange={onChange} />);

    const toRemove = STATUS_OPTIONS[0];

    await user.click(screen.getByRole("button", { name: toRemove.label }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([STATUS_OPTIONS[1].value]);
  });

  it("supports keyboard interaction (Enter key)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ShipmentStatusFilter value={[]} onChange={onChange} />);

    const btn = screen.getByRole("button", {
      name: STATUS_OPTIONS[0].label,
    });

    btn.focus();
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith([STATUS_OPTIONS[0].value]);
  });
});
