export type BoardCard = {
  id: string;
  title: string;
  details: string;
};

export type BoardColumn = {
  id: string;
  title: string;
  cardIds: string[];
};

export type BoardState = {
  columnOrder: string[];
  columns: Record<string, BoardColumn>;
  cards: Record<string, BoardCard>;
};

export type AddCardInput = {
  columnId: string;
  cardId: string;
  title: string;
  details: string;
};

export type DeleteCardInput = {
  columnId: string;
  cardId: string;
};

export type MoveCardInput = {
  cardId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
};
