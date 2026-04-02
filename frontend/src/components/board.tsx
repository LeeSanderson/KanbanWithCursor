"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";

import { Column } from "@/components/column";
import { addCard, deleteCard, moveCard, renameColumn } from "@/lib/board-actions";
import type { BoardState } from "@/lib/board-types";

type BoardProps = {
  initialBoard: BoardState;
};

type DragData = {
  type: "card" | "column";
  cardId?: string;
  columnId: string;
  index?: number;
};

export function Board({ initialBoard }: BoardProps) {
  const [board, setBoard] = useState(initialBoard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeCard = activeCardId ? board.cards[activeCardId] : null;
  const columns = useMemo(
    () =>
      board.columnOrder.map((columnId) => {
        const column = board.columns[columnId];

        return {
          column,
          cards: column.cardIds.map((cardId) => board.cards[cardId]),
        };
      }),
    [board],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCardId(null);

    if (!event.over) {
      return;
    }

    const activeData = event.active.data.current as DragData | undefined;
    const overData = event.over.data.current as DragData | undefined;

    if (!activeData || !overData || activeData.type !== "card") {
      return;
    }

    const destinationColumnId = overData.columnId;
    let destinationIndex = overData.type === "card" ? overData.index ?? 0 : 0;

    if (overData.type === "column") {
      const destinationColumn = board.columns[overData.columnId];

      if (!destinationColumn) {
        return;
      }

      destinationIndex =
        activeData.columnId === overData.columnId
          ? Math.max(destinationColumn.cardIds.length - 1, 0)
          : destinationColumn.cardIds.length;
    }

    setBoard((currentBoard) =>
      moveCard(currentBoard, {
        cardId: activeData.cardId ?? String(event.active.id),
        sourceColumnId: activeData.columnId,
        destinationColumnId,
        sourceIndex: activeData.index ?? 0,
        destinationIndex,
      }),
    );
  }

  return (
    <DndContext
      id="kanban-board-dnd"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-8 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-white/75 px-6 py-7 shadow-[0_24px_70px_rgba(3,33,71,0.12)] backdrop-blur md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--color-blue-primary)]">
                Single-board Kanban MVP
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-navy)] md:text-5xl">
                Move work forward with a lightweight board that feels refined from the first click.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--color-gray-text)] md:text-lg">
                Rename any lane, add or delete cards, and drag work across the fixed five-column
                flow without any persistence overhead.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[color:var(--color-navy)] px-4 py-3 text-white shadow-[0_16px_32px_rgba(3,33,71,0.2)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Columns</p>
                <p className="mt-2 text-3xl font-semibold">{board.columnOrder.length}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-[color:var(--color-navy)] shadow-[0_16px_32px_rgba(3,33,71,0.08)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-gray-text)]">
                  Cards
                </p>
                <p className="mt-2 text-3xl font-semibold">{Object.keys(board.cards).length}</p>
              </div>
              <div className="rounded-2xl bg-[color:var(--color-accent-yellow)] px-4 py-3 text-[color:var(--color-navy)] shadow-[0_16px_32px_rgba(236,173,10,0.25)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-navy)]/70">
                  State
                </p>
                <p className="mt-2 text-3xl font-semibold">Live</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 overflow-x-auto pb-6">
          <div className="flex min-w-max gap-5">
            {columns.map(({ column, cards }) => (
              <Column
                key={column.id}
                column={column}
                cards={cards}
                onRename={(columnId, title) =>
                  setBoard((currentBoard) => renameColumn(currentBoard, columnId, title))
                }
                onAddCard={(columnId, title, details) =>
                  setBoard((currentBoard) =>
                    addCard(currentBoard, {
                      columnId,
                      title,
                      details,
                      cardId: crypto.randomUUID(),
                    }),
                  )
                }
                onDeleteCard={(columnId, cardId) =>
                  setBoard((currentBoard) => deleteCard(currentBoard, { columnId, cardId }))
                }
              />
            ))}
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="w-[288px] rounded-3xl border border-white/80 bg-white p-4 shadow-[0_24px_60px_rgba(3,33,71,0.18)]">
            <p className="text-sm font-semibold text-[color:var(--color-navy)]">
              {activeCard.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-gray-text)]">
              {activeCard.details}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
