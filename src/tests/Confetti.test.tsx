import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { Confetti } from '../components/Confetti';

describe('Confetti', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<Confetti />);
    expect(container.querySelector('.confetti-container')).toBeInTheDocument();
  });

  it('cleans up confetti after animation', async () => {
    const { container } = render(<Confetti />);
    
    // Initially should have confetti pieces
    expect(container.querySelectorAll('.confetti').length).toBeGreaterThan(0);
    
    // After timeout, confetti should be cleared
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Force a re-render to ensure state updates are processed
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(container.querySelectorAll('.confetti').length).toBe(0);
  });
});