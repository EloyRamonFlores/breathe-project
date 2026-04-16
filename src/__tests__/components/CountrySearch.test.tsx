/**
 * CountrySearch component tests
 * Tests: search filtering, empty-query state, no-results message, click selection,
 *        keyboard navigation (ArrowDown / ArrowUp / Enter / Escape).
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (values) {
      return Object.entries(values).reduce(
        (s, [k, v]) => s.replace(`{${k}}`, String(v)),
        key
      );
    }
    return key;
  },
}));

const mockRouterPush = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// CountryFlag renders an <img>; fine in jsdom, no mock needed.

// ─── Import component after mocks ─────────────────────────────────────────────
import CountrySearch from "@/components/search/CountrySearch";

// ─── Helpers ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockRouterPush.mockClear();
});

function renderSearch(onSelect?: (c: unknown) => void) {
  render(
    <CountrySearch locale="en" onSelect={onSelect as never} />
  );
  return screen.getByRole("combobox");
}

// ─── Search & filtering ───────────────────────────────────────────────────────

describe("search filtering", () => {
  it("shows no dropdown when query is empty", () => {
    renderSearch();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows matching countries when typing", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "Germany");

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeDefined();

    const options = screen.getAllByRole("option");
    expect(options.some((o) => o.textContent?.includes("Germany"))).toBe(true);
  });

  it("shows no-results message when query matches nothing", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "zzzzzznotacountry");

    expect(screen.queryByRole("listbox")).toBeNull();
    // no-results text is rendered as a plain div (not a listbox)
    expect(screen.getByText("search_no_results")).toBeDefined();
  });

  it("caps results at 8 entries for a broad query", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "a"); // matches many countries

    const options = screen.getAllByRole("option");
    expect(options.length).toBeLessThanOrEqual(8);
  });
});

// ─── Selection ────────────────────────────────────────────────────────────────

describe("selection", () => {
  it("calls onSelect with the country when clicking an option", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const input = renderSearch(onSelect);

    await user.type(input, "Australia");
    const option = screen.getAllByRole("option").find((o) =>
      o.textContent?.includes("Australia")
    )!;
    await user.click(option);

    expect(onSelect).toHaveBeenCalledOnce();
    const [selected] = onSelect.mock.calls[0];
    expect((selected as { name: string }).name).toBe("Australia");
  });

  it("closes dropdown and clears query after selection", async () => {
    const user = userEvent.setup();
    const input = renderSearch(vi.fn());

    await user.type(input, "Australia");
    await user.click(
      screen.getAllByRole("option").find((o) =>
        o.textContent?.includes("Australia")
      )!
    );

    expect(screen.queryByRole("listbox")).toBeNull();
    expect((input as HTMLInputElement).value).toBe("");
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

describe("keyboard navigation", () => {
  it("ArrowDown highlights the first option", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "Germany");
    await user.keyboard("{ArrowDown}");

    const firstOption = screen.getAllByRole("option")[0];
    expect(firstOption.getAttribute("aria-selected")).toBe("true");
  });

  it("ArrowDown then ArrowDown highlights the second option", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "a"); // broad query → multiple results

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    const options = screen.getAllByRole("option");
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
  });

  it("ArrowUp from index 1 goes back to index 0", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "a");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowUp}");

    const options = screen.getAllByRole("option");
    expect(options[0].getAttribute("aria-selected")).toBe("true");
  });

  it("Enter selects the highlighted option", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const input = renderSearch(onSelect);

    await user.type(input, "Germany");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledOnce();
    expect((onSelect.mock.calls[0][0] as { name: string }).name).toBe("Germany");
  });

  it("Escape closes the dropdown", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "Germany");
    expect(screen.getByRole("listbox")).toBeDefined();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("clear button resets query and closes dropdown", async () => {
    const user = userEvent.setup();
    const input = renderSearch();

    await user.type(input, "Germany");
    expect(screen.getByRole("listbox")).toBeDefined();

    const clearBtn = screen.getByRole("button", { name: "search_clear" });
    await user.click(clearBtn);

    expect((input as HTMLInputElement).value).toBe("");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
