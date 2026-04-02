import type {
  AddCardInput,
  BoardCard,
  BoardState,
  DeleteCardInput,
  MoveCardInput,
} from "@/lib/board-types";

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(index, max));
}

export function renameColumn(
  board: BoardState,
  columnId: string,
  nextTitle: string,
): BoardState {
  const column = board.columns[columnId];
  const trimmedTitle = nextTitle.trim();

  if (!column || !trimmedTitle || column.title === trimmedTitle) {
    return board;
  }

  return {
    ...board,
    columns: {
      ...board.columns,
      [columnId]: {
        ...column,
        title: trimmedTitle,
      },
    },
  };
}

export function addCard(board: BoardState, input: AddCardInput): BoardState {
  const column = board.columns[input.columnId];
  const title = input.title.trim();
  const details = input.details.trim();

  if (!column || !title || board.cards[input.cardId]) {
    return board;
  }

  const nextCard: BoardCard = {
    id: input.cardId,
    title,
    details,
  };

  return {
    ...board,
    columns: {
      ...board.columns,
      [input.columnId]: {
        ...column,
        cardIds: [...column.cardIds, nextCard.id],
      },
    },
    cards: {
      ...board.cards,
      [nextCard.id]: nextCard,
    },
  };
}

export function deleteCard(board: BoardState, input: DeleteCardInput): BoardState {
  const column = board.columns[input.columnId];

  if (!column || !board.cards[input.cardId]) {
    return board;
  }

  const nextCards = { ...board.cards };
  delete nextCards[input.cardId];

  return {
    ...board,
    columns: {
      ...board.columns,
      [input.columnId]: {
        ...column,
        cardIds: column.cardIds.filter((cardId) => cardId !== input.cardId),
      },
    },
    cards: nextCards,
  };
}

export function moveCard(board: BoardState, input: MoveCardInput): BoardState {
  const sourceColumn = board.columns[input.sourceColumnId];
  const destinationColumn = board.columns[input.destinationColumnId];

  if (!sourceColumn || !destinationColumn || !board.cards[input.cardId]) {
    return board;
  }

  if (sourceColumn.cardIds[input.sourceIndex] !== input.cardId) {
    return board;
  }

  if (
    input.sourceColumnId === input.destinationColumnId &&
    input.sourceIndex === input.destinationIndex
  ) {
    return board;
  }

  if (input.sourceColumnId === input.destinationColumnId) {
    const nextCardIds = [...sourceColumn.cardIds];
    const [movedCardId] = nextCardIds.splice(input.sourceIndex, 1);

    if (!movedCardId) {
      return board;
    }

    const destinationIndex = clampIndex(input.destinationIndex, nextCardIds.length);
    nextCardIds.splice(destinationIndex, 0, movedCardId);

    return {
      ...board,
      columns: {
        ...board.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          cardIds: nextCardIds,
        },
      },
    };
  }

  const nextSourceCardIds = [...sourceColumn.cardIds];
  const [movedCardId] = nextSourceCardIds.splice(input.sourceIndex, 1);

  if (!movedCardId) {
    return board;
  }

  const nextDestinationCardIds = [...destinationColumn.cardIds];
  const destinationIndex = clampIndex(
    input.destinationIndex,
    nextDestinationCardIds.length,
  );

  nextDestinationCardIds.splice(destinationIndex, 0, movedCardId);

  return {
    ...board,
    columns: {
      ...board.columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        cardIds: nextSourceCardIds,
      },
      [destinationColumn.id]: {
        ...destinationColumn,
        cardIds: nextDestinationCardIds,
      },
    },
  };
}
