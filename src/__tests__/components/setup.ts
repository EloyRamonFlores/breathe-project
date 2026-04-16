import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom does not implement scrollIntoView — stub it globally (guard for node env)
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

afterEach(() => {
  cleanup();
});
