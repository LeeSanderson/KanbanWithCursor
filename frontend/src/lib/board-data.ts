import type { BoardState } from "@/lib/board-types";

export function createInitialBoard(): BoardState {
  return {
    columnOrder: ["backlog", "design", "progress", "review", "done"],
    columns: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        cardIds: ["card-1", "card-2"],
      },
      design: {
        id: "design",
        title: "Design",
        cardIds: ["card-3", "card-4"],
      },
      progress: {
        id: "progress",
        title: "In Progress",
        cardIds: ["card-5"],
      },
      review: {
        id: "review",
        title: "Review",
        cardIds: ["card-6"],
      },
      done: {
        id: "done",
        title: "Done",
        cardIds: ["card-7"],
      },
    },
    cards: {
      "card-1": {
        id: "card-1",
        title: "Clarify launch messaging",
        details: "Tighten the hero copy so the board feels purposeful from the first glance.",
      },
      "card-2": {
        id: "card-2",
        title: "Trim setup friction",
        details: "Remove any unnecessary UI chrome so adding a task feels immediate.",
      },
      "card-3": {
        id: "card-3",
        title: "Explore column treatments",
        details: "Test soft gradients, subtle borders, and elevated cards within the palette.",
      },
      "card-4": {
        id: "card-4",
        title: "Refine empty-state language",
        details: "Keep copy crisp, helpful, and aligned with the premium MVP tone.",
      },
      "card-5": {
        id: "card-5",
        title: "Build draggable card shell",
        details: "Keep the card body compact while preserving a clear grab target and depth.",
      },
      "card-6": {
        id: "card-6",
        title: "Review interaction polish",
        details: "Check focus states, hover states, and drag affordances before final pass.",
      },
      "card-7": {
        id: "card-7",
        title: "Approve color direction",
        details: "Confirm the accent yellow, blue, purple, and navy feel balanced together.",
      },
    },
  };
}
