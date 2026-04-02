"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
  columnTitle: string;
  onSubmit: (title: string, details: string) => void;
};

export function AddCardForm({ columnTitle, onSubmit }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSubmit(title, details);
    setTitle("");
    setDetails("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Add card to ${columnTitle}`}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-dashed border-[color:var(--color-blue-primary)]/35 bg-white/70 px-4 py-3 text-sm font-semibold text-[color:var(--color-blue-primary)] transition hover:border-[color:var(--color-blue-primary)] hover:bg-white"
      >
        Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-white/80 bg-white p-4 shadow-[0_18px_40px_rgba(3,33,71,0.08)]"
    >
      <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--color-navy)]">
        Title
        <input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-blue-primary)] focus:bg-white"
          placeholder="Card title"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--color-navy)]">
        Details
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--color-blue-primary)] focus:bg-white"
          placeholder="What needs to happen?"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-[color:var(--color-purple-secondary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Create card
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setDetails("");
            setIsOpen(false);
          }}
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--color-gray-text)] transition hover:text-[color:var(--color-navy)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
