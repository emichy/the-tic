import { describe, it, expect } from 'vitest';
import { 
  calculateWinner,
  getAvailableMoves,
  isWinningMove,
  findWinningMove,
  findStrategicMove
} from '../utils/gameLogic';
import type { Board } from '../types';

describe('Game Logic', () => {
  describe('calculateWinner', () => {
    it('should return null when there is no winner', () => {
      const board: Board = Array(9).fill(null);
      const [winner, line] = calculateWinner(board);
      expect(winner).toBeNull();
      expect(line).toBeNull();
    });

    it('should detect horizontal wins', () => {
      const board: Board = [0, 0, 0, null, null, null, null, null, null];
      const [winner, line] = calculateWinner(board);
      expect(winner).toBe(0);
      expect(line).toEqual([0, 1, 2]);
    });

    it('should detect vertical wins', () => {
      const board: Board = [1, null, null, 1, null, null, 1, null, null];
      const [winner, line] = calculateWinner(board);
      expect(winner).toBe(1);
      expect(line).toEqual([0, 3, 6]);
    });

    it('should detect diagonal wins', () => {
      const board: Board = [0, null, null, null, 0, null, null, null, 0];
      const [winner, line] = calculateWinner(board);
      expect(winner).toBe(0);
      expect(line).toEqual([0, 4, 8]);
    });
  });

  describe('getAvailableMoves', () => {
    it('should return all positions for empty board', () => {
      const board: Board = Array(9).fill(null);
      expect(getAvailableMoves(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return only empty positions', () => {
      const board: Board = [0, null, 1, null, 0, null, 1, null, 0];
      expect(getAvailableMoves(board)).toEqual([1, 3, 5, 7]);
    });

    it('should return empty array for full board', () => {
      const board: Board = [0, 1, 0, 1, 0, 1, 0, 1, 0];
      expect(getAvailableMoves(board)).toEqual([]);
    });
  });

  describe('isWinningMove', () => {
    it('should detect winning move', () => {
      const board: Board = [0, 0, null, null, null, null, null, null, null];
      expect(isWinningMove(board, 2, 0)).toBe(true);
    });

    it('should return false for non-winning move', () => {
      const board: Board = [0, null, null, null, null, null, null, null, null];
      expect(isWinningMove(board, 1, 0)).toBe(false);
    });
  });

  describe('findWinningMove', () => {
    it('should find winning move when available', () => {
      const board: Board = [0, 0, null, null, null, null, null, null, null];
      expect(findWinningMove(board, 0)).toBe(2);
    });

    it('should return null when no winning move exists', () => {
      const board: Board = [0, null, null, null, null, null, null, null, null];
      expect(findWinningMove(board, 0)).toBeNull();
    });
  });

  describe('findStrategicMove', () => {
    it('should prefer center position when available', () => {
      const board: Board = Array(9).fill(null);
      expect(findStrategicMove(board)).toBe(4);
    });

    it('should choose corner when center is taken', () => {
      const board: Board = [null, null, null, null, 0, null, null, null, null];
      const move = findStrategicMove(board);
      expect([0, 2, 6, 8]).toContain(move);
    });

    it('should choose edge when center and corners are taken', () => {
      const board: Board = [0, null, 1, null, 0, null, 1, null, 0];
      const move = findStrategicMove(board);
      expect([1, 3, 5, 7]).toContain(move);
    });
  });
});