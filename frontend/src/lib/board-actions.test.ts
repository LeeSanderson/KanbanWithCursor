import { describe, expect, it } from "vitest";

import { addCard, deleteCard, moveCard, renameColumn } from "@/lib/board-actions";
import { createInitialBoard } from "@/lib/board-data";

describe("board actions", () => {
  it("renames a column with trimmed input", () => {
    const board = createInitialBoard();

    const result = renameColumn(board, "backlog", "  Ideas  ");

    expect(result.columns.backlog.title).toBe("Ideas");
  });

  it("adds a card to a column", () => {
    const board = createInitialBoard();

    const result = addCard(board, {
      columnId: "backlog",
      cardId: "card-new",
      title: "Draft release checklist",
      details: "Keep the copy sharp and the interactions snappy.",
    });

    expect(result.cards["card-new"]).toMatchObject({
      title: "Draft release checklist",
      details: "Keep the copy sharp and the interactions snappy.",
    });
    expect(result.columns.backlog.cardIds.at(-1)).toBe("card-new");
  });

  it("deletes a card from the board", () => {
    const board = createInitialBoard();

    const result = deleteCard(board, {
      columnId: "done",
      cardId: "card-7",
    });

    expect(result.cards["card-7"]).toBeUndefined();
    expect(result.columns.done.cardIds).not.toContain("card-7");
  });

  it("reorders cards within the same column", () => {
    const board = createInitialBoard();

    const result = moveCard(board, {
      cardId: "card-1",
      sourceColumnId: "backlog",
      destinationColumnId: "backlog",
      sourceIndex: 0,
      destinationIndex: 1,
    });

    expect(result.columns.backlog.cardIds).toEqual(["card-2", "card-1"]);
  });

  it("moves cards across columns", () => {
    const board = createInitialBoard();

    const result = moveCard(board, {
      cardId: "card-5",
      sourceColumnId: "progress",
      destinationColumnId: "review",
      sourceIndex: 0,
      destinationIndex: 1,
    });

    expect(result.columns.progress.cardIds).toEqual([]);
    expect(result.columns.review.cardIds).toEqual(["card-6", "card-5"]);
  });
});
