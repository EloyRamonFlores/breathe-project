/**
 * RiskChecker component tests
 * Tests: URL param decoding (valid/invalid), initial step rendering, basic form flow.
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─── Module mocks ─────────────────────────────────────────────────────────────

// next-intl: return translation key as value so tests are key-stable
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Configurable URLSearchParams so we can test URL param decoding per-test
let _searchParamsStr = "";
const mockRouterPush = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(_searchParamsStr),
  useRouter: () => ({ push: mockRouterPush }),
}));

// Stub RiskResults so we don't pull in its deep dependency tree
vi.mock("@/components/checker/RiskResults", () => ({
  default: ({ onReset }: { onReset: () => void }) => (
    <div data-testid="risk-results">
      <button onClick={onReset}>reset</button>
    </div>
  ),
}));

// CountryFlag is just an img — no mock needed, renders fine in jsdom

// ─── Import component after mocks are registered ──────────────────────────────
import RiskChecker from "@/components/checker/RiskChecker";

// ─── Helpers ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  _searchParamsStr = "";
  mockRouterPush.mockClear();
});

// ─── URL param decoding ───────────────────────────────────────────────────────

describe("URL param decoding", () => {
  it("renders results directly when valid params are present (country=au, era=1960-1980, type=residential)", () => {
    _searchParamsStr = "country=au&era=1960-1980&type=residential";
    render(<RiskChecker />);
    expect(screen.getByTestId("risk-results")).toBeDefined();
    // Step 1 input should NOT be visible
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("shows validation error banner when params are partial / unrecognised", () => {
    _searchParamsStr = "country=xx&era=1960-1980&type=residential";
    render(<RiskChecker />);
    // Alert is shown and we are back at step 1
    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("starts at step 1 with no URL params", () => {
    render(<RiskChecker />);
    expect(screen.getByRole("textbox")).toBeDefined();
    expect(screen.queryByTestId("risk-results")).toBeNull();
  });
});

// ─── Form flow ────────────────────────────────────────────────────────────────

describe("form flow", () => {
  it("typing in the country input opens the dropdown and shows matches", async () => {
    const user = userEvent.setup();
    render(<RiskChecker />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Australia");

    // Dropdown listbox should appear
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeDefined();

    // Australia option should be visible
    const options = screen.getAllByRole("option");
    const australiaOption = options.find((o) =>
      o.textContent?.includes("Australia")
    );
    expect(australiaOption).toBeDefined();
  });

  it("selecting a country advances to step 2 (era selector)", async () => {
    const user = userEvent.setup();
    render(<RiskChecker />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Australia");

    const options = screen.getAllByRole("option");
    const australiaOption = options.find((o) =>
      o.textContent?.includes("Australia")
    )!;
    await user.click(australiaOption);

    // Step 2 shows era buttons — wait for the 150 ms setTimeout
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const eraButton = buttons.find((b) => b.textContent?.includes("pre_1940"));
      expect(eraButton).toBeDefined();
    });
  });

  it("selecting an era advances to step 3 (building type selector)", async () => {
    const user = userEvent.setup();
    render(<RiskChecker />);

    // Step 1: select country
    await user.type(screen.getByRole("textbox"), "Australia");
    const options = screen.getAllByRole("option");
    const australiaOption = options.find((o) =>
      o.textContent?.includes("Australia")
    )!;
    await user.click(australiaOption);

    // Step 2: select era
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.some((b) => b.textContent?.includes("pre_1940"))).toBe(true);
    });

    const eraButtons = screen.getAllByRole("button");
    const eraBtn = eraButtons.find((b) => b.textContent?.includes("pre_1940"))!;
    await user.click(eraBtn);

    // Step 3: building type buttons appear
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.some((b) => b.textContent?.includes("residential"))).toBe(true);
    });
  });

  it("selecting a building type shows results and pushes URL", async () => {
    const user = userEvent.setup();
    render(<RiskChecker />);

    // Step 1
    await user.type(screen.getByRole("textbox"), "Australia");
    const option = screen.getAllByRole("option").find((o) =>
      o.textContent?.includes("Australia")
    )!;
    await user.click(option);

    // Step 2
    await waitFor(() =>
      screen.getAllByRole("button").some((b) => b.textContent?.includes("pre_1940"))
    );
    await user.click(
      screen.getAllByRole("button").find((b) => b.textContent?.includes("pre_1940"))!
    );

    // Step 3
    await waitFor(() => {
      expect(
        screen.getAllByRole("button").some((b) => b.textContent?.includes("residential"))
      ).toBe(true);
    });
    await user.click(
      screen.getAllByRole("button").find((b) => b.textContent?.includes("residential"))!
    );

    // Results
    await waitFor(() => {
      expect(screen.getByTestId("risk-results")).toBeDefined();
    });

    // URL should have been updated
    expect(mockRouterPush).toHaveBeenCalled();
    const [[url]] = mockRouterPush.mock.calls;
    expect(url).toContain("country=");
    expect(url).toContain("era=");
    expect(url).toContain("type=residential");
  });
});
