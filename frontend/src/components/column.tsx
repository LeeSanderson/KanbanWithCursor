"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";

import { AddCardForm } from "@/components/add-card-form";
import { CardItem } from "@/components/card-item";
import type { BoardCard, BoardColumn } from "@/lib/board-types";

type ColumnProps = {
  column: BoardColumn;
  cards: BoardCard[];
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
};

export function Column({
  column,
  cards,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [draftTitle, setDraftTitle] = useState(column.title);
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  function commitTitle() {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle) {
      setDraftTitle(column.title);
      return;
    }

    if (trimmedTitle !== column.title) {
      onRename(column.id, trimmedTitle);
    }
  }

  return (
    <section
      role="region"
      aria-label={`${column.title} column`}
      data-testid={`column-${column.id}`}
      className="flex min-h-[620px] w-[320px] shrink-0 flex-col rounded-[28px] border border-white/80 bg-white/65 p-5 shadow-[0_28px_80px_rgba(3,33,71,0.12)] backdrop-blur"
    >
      <div className="mb-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-blue-primary)]">
              Fixed lane
            </p>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitTitle();
                  event.currentTarget.blur();
                }
              }}
              aria-label={`Rename ${column.id} column`}
              className="w-full rounded-xl border border-transparent bg-transparent px-2 py-1 text-xl font-semibold text-[color:var(--color-navy)] outline-none transition focus:border-[color:var(--color-blue-primary)] focus:bg-white"
            />
          </div>
          <span className="rounded-full bg-[color:var(--color-blue-primary)]/10 px-3 py-1 text-sm font-semibold text-[color:var(--color-blue-primary)]">
            {cards.length}
          </span>
        </div>
        <p className="text-sm leading-6 text-[color:var(--color-gray-text)]">
          Keep tasks focused, lightweight, and ready to move when the next step is clear.
        </p>
      </div>

      <div
        ref={setNodeRef}
        data-testid={`column-dropzone-${column.id}`}
        className={`flex flex-1 flex-col gap-3 rounded-[24px] border border-dashed p-3 transition ${
          isOver
            ? "border-[color:var(--color-accent-yellow)] bg-[color:var(--color-accent-yellow)]/12"
            : "border-white/70 bg-white/45"
        }`}
      >
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                columnId={column.id}
                index={index}
                onDelete={(cardId) => onDeleteCard(column.id, cardId)}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/80 bg-white/60 px-4 py-8 text-center text-sm leading-6 text-[color:var(--color-gray-text)]">
              Drop a card here or add something new when the lane is ready.
            </div>
          )}
        </SortableContext>
      </div>

      <div className="mt-4">
        <AddCardForm
          columnTitle={column.title}
          onSubmit={(title, details) => onAddCard(column.id, title, details)}
        />
      </div>
    </section>
  );
}
