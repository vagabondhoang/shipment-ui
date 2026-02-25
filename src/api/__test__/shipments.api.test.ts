import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchShipments,
  updateShipment,
} from "../shipments.api";
import type { Shipment } from "@/types/shipment";

const mockShipment: Shipment = {
  id: "SHP-001",
  client_name: "ACME Corp",
  container_label: "CONT-001",
  status: "OPEN",
  arrival_date: "2024-01-01",
  delivery_by_date: "2024-01-05",
  warehouse_id: "WH-01",
  eta: "2024-01-02T10:00:00Z",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchShipments", () => {
  it("calls API with correct query params and returns data", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([mockShipment]),
      headers: {
        get: vi.fn().mockReturnValue("42"),
      },
    });

    globalThis.fetch = fetchMock as any;

    const result = await fetchShipments({
      page: 2,
      perPage: 10,
      q: "acme",
      statuses: ["OPEN", "DELIVERED"],
    });

    expect(fetchMock).toHaveBeenCalledOnce();

    const url = fetchMock.mock.calls[0][0] as string;

    expect(url).toContain("/shipments?");
    expect(url).toContain("_page=2");
    expect(url).toContain("_limit=10");
    expect(url).toContain("q=acme");
    expect(url).toContain("status=OPEN");
    expect(url).toContain("status=DELIVERED");

    expect(result).toEqual({
      data: [mockShipment],
      total: 42,
    });
  });

  it("returns total = 0 if X-Total-Count header missing", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
      headers: {
        get: vi.fn().mockReturnValue(null),
      },
    }) as any;

    const result = await fetchShipments({
      page: 1,
      perPage: 10,
    });

    expect(result.total).toBe(0);
  });

  it("throws error when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    await expect(
      fetchShipments({ page: 1, perPage: 10 })
    ).rejects.toThrow("Failed to fetch shipments");
  });
});

describe("updateShipment", () => {
  it("calls PATCH API with correct payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        ...mockShipment,
        status: "DELIVERED",
      }),
    });

    globalThis.fetch = fetchMock as any;

    const result = await updateShipment(
      mockShipment.id,
      { status: "DELIVERED" }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/shipments/SHP-001",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "DELIVERED" }),
      }
    );

    expect(result.status).toBe("DELIVERED");
  });

  it("throws error when update fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    await expect(
      updateShipment("SHP-001", { status: "IN_TRANSIT" })
    ).rejects.toThrow("Failed to update shipment");
  });
});
