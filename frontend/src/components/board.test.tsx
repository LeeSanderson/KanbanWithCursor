import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Board } from "@/components/board";
import { createInitialBoard } from "@/lib/board-data";

afterEach(() => {
  cleanup();
});

describe("Board", () => {
  it("renders the fixed five columns", () => {
    render(<Board initialBoard={createInitialBoard()} />);

    expect(screen.getAllByRole("region")).toHaveLength(5);
  });

  it("renames a column, adds a card, and deletes it", async () => {
    const user = userEvent.setup();
    render(<Board initialBoard={createInitialBoard()} />);

    const backlogColumn = screen.getByTestId("column-backlog");
    const backlogInput = within(backlogColumn).getByLabelText("Rename backlog column");
    await user.clear(backlogInput);
    await user.type(backlogInput, "Ideas");
    await user.tab();

    expect(screen.getByDisplayValue("Ideas")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add card to Ideas" }));
    await user.type(screen.getByLabelText("Title"), "Ship polished hover states");
    await user.type(
      screen.getByLabelText("Details"),
      "Keep transitions smooth and restrained across the board.",
    );
    await user.click(screen.getByRole("button", { name: "Create card" }));

    expect(within(backlogColumn).getByText("Ship polished hover states")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Ship polished hover states" }));

    expect(
      within(backlogColumn).queryByText("Ship polished hover states"),
    ).not.toBeInTheDocument();
  });
});
