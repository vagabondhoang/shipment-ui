import "@testing-library/jest-dom";

// mock fetch
globalThis.fetch = vi.fn();

// mock <dialog> APIs
HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

// mock scroll APIs
Object.defineProperty(HTMLElement.prototype, "scrollTop", {
  configurable: true,
  value: 0,
  writable: true,
});

HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 100,
  height: 20,
  top: 0,
  left: 0,
  bottom: 20,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {},
}));
