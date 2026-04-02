import { Board } from "@/components/board";
import { createInitialBoard } from "@/lib/board-data";

export default function Home() {
  return <Board initialBoard={createInitialBoard()} />;
}
