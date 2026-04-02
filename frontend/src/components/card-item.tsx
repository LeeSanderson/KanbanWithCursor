"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { BoardCard } from "@/lib/board-types";

type CardItemProps = {
  card: BoardCard;
  columnId: string;
  index: number;
  onDelete: (cardId: string) => void;
};

export function CardItem({ card, columnId, index, onDelete }: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      data: {
        type: "card",
        cardId: card.id,
        columnId,
        index,
      },
    });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-testid={`card-${card.id}`}
      className={`rounded-3xl border border-white/80 bg-white p-4 shadow-[0_18px_40px_rgba(3,33,71,0.1)] transition ${
        isDragging ? "rotate-1 opacity-90 shadow-[0_24px_60px_rgba(3,33,71,0.18)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="flex-1 cursor-grab text-left active:cursor-grabbing"
          aria-label={`Drag ${card.title}`}
          {...attributes}
          {...listeners}
        >
          <p className="text-sm font-semibold text-[color:var(--color-navy)]">
            {card.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-gray-text)]">
            {card.details}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          aria-label={`Delete ${card.title}`}
          className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-[color:var(--color-gray-text)] transition hover:border-[color:var(--color-accent-yellow)] hover:text-[color:var(--color-navy)]"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
