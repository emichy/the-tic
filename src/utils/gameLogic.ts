import type { Board, Square } from '../types';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
] as const;

export const STRATEGIC_POSITIONS = [
  4,  // Center
  0, 2, 6, 8,  // Corners
  1, 3, 5, 7   // Edges
] as const;

export const calculateWinner = (squares: Board): [Square, number[] | null] => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] != null && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], combination];
    }
  }
  return [null, null];
};

export const getAvailableMoves = (squares: Board): number[] => {
  return squares.reduce<number[]>((moves, square, index) => {
    if (square === null) moves.push(index);
    return moves;
  }, []);
};

export const isWinningMove = (squares: Board, position: number, player: number): boolean => {
  const newBoard = [...squares];
  newBoard[position] = player;
  const [winner] = calculateWinner(newBoard);
  return winner === player;
};

export const findWinningMove = (squares: Board, player: number): number | null => {
  const availableMoves = getAvailableMoves(squares);
  for (const move of availableMoves) {
    if (isWinningMove(squares, move, player)) {
      return move;
    }
  }
  return null;
};

export const findStrategicMove = (squares: Board): number => {
  for (const position of STRATEGIC_POSITIONS) {
    if (squares[position] === null) {
      return position;
    }
  }
  return getAvailableMoves(squares)[0];
};