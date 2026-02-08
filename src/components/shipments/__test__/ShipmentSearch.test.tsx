import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShipmentSearch } from "../ShipmentSearch";

import { useState } from "react";

function Wrapper() {
  const [value, setValue] = useState("");
  return <ShipmentSearch value={value} onChange={setValue} />;
}

describe("ShipmentSearch", () => {
  it("renders search input with correct role and placeholder", () => {
    render(<ShipmentSearch value="" onChange={vi.fn()} />);

    const search = screen.getByRole("search");
    const input = screen.getByPlaceholderText(
      /search by client or container label/i
    );

    expect(search).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("updates value when typing (controlled usage)", async () => {
    const user = userEvent.setup();

    render(<Wrapper />);

    const input = screen.getByRole("textbox");

    await user.type(input, "sam");

    expect(input).toHaveValue("sam");
  });

  it("shows spinner when loading", () => {
    render(<ShipmentSearch value="sam" onChange={vi.fn()} loading />);

    const spinner = screen.getByRole("status", { name: /loading/i });

    expect(spinner).toBeInTheDocument();

    // clear button should NOT appear
    expect(
      screen.queryByRole("button", { name: /clear search/i })
    ).not.toBeInTheDocument();
  });

  it("sets aria-busy on input when loading", () => {
    render(<ShipmentSearch value="sam" onChange={vi.fn()} loading />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-busy", "true");
  });

  it("shows clear button when there is value and not loading", () => {
    render(<ShipmentSearch value="sam" onChange={vi.fn()} loading={false} />);

    const clearButton = screen.getByRole("button", {
      name: /clear search/i,
    });

    expect(clearButton).toBeInTheDocument();
  });

  it("clears value when clicking clear button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ShipmentSearch value="sam" onChange={onChange} />);

    const clearButton = screen.getByRole("button", {
      name: /clear search/i,
    });

    await user.click(clearButton);

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("does not submit form on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ShipmentSearch value="" onChange={onChange} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "{enter}");

    // no submit side-effect, component is stable
    expect(onChange).not.toHaveBeenCalledWith(expect.anything());
  });
});
