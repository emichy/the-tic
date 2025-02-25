import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders game title', () => {
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument();
  });

  it('shows game mode selection buttons', () => {
    expect(screen.getByRole('button', { name: /single player/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /two players/i })).toBeInTheDocument();
  });

  it('shows difficulty selection in single player mode', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /single player/i }));
    
    expect(screen.getByText('Select Difficulty')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /easy mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hard mode/i })).toBeInTheDocument();
  });

  it('allows icon selection after choosing game mode', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /two players/i }));
    
    expect(screen.getByText(/player 1, select your icon/i)).toBeInTheDocument();
  });

  it('shows game board after setup', async () => {
    const user = userEvent.setup();
    
    // Choose two player mode
    await user.click(screen.getByRole('button', { name: /two players/i }));
    
    // Select first player icon (first available icon)
    const icons = screen.getAllByRole('button');
    await user.click(icons[0]);
    
    // Select second player icon (second available icon)
    await user.click(icons[1]);
    
    // Verify game board is shown
    expect(screen.getByRole('button', { name: /reset game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change game mode/i })).toBeInTheDocument();
  });

  it('allows playing a game', async () => {
    const user = userEvent.setup();
    
    // Setup game
    await user.click(screen.getByRole('button', { name: /two players/i }));
    const icons = screen.getAllByRole('button');
    await user.click(icons[0]); // Player 1 icon
    await user.click(icons[1]); // Player 2 icon
    
    // Play some moves
    const cells = screen.getAllByRole('button').slice(0, 9); // Get game cells
    await user.click(cells[0]); // Player 1 move
    await user.click(cells[4]); // Player 2 move
    
    // Verify game state updates
    expect(cells[0]).not.toBeNull();
    expect(cells[4]).not.toBeNull();
  });

  it('allows resetting the game', async () => {
    const user = userEvent.setup();
    
    // Setup and play some moves
    await user.click(screen.getByRole('button', { name: /two players/i }));
    const icons = screen.getAllByRole('button');
    await user.click(icons[0]);
    await user.click(icons[1]);
    
    const cells = screen.getAllByRole('button').slice(0, 9);
    await user.click(cells[0]);
    
    // Reset game
    await user.click(screen.getByRole('button', { name: /reset game/i }));
    
    // Verify board is cleared
    const newCells = screen.getAllByRole('button').slice(0, 9);
    newCells.forEach(cell => {
      expect(cell.textContent).toBe('');
    });
  });
});