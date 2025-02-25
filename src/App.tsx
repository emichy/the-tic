import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, X, Circle,
  Dog, Cat, Fish, Bird, Flower2, Trees as Tree, 
  Snowflake, Sun, Cloud, Star, Trophy, Bath,
  Heart, Music, Gamepad2, Rocket, Pizza, Coffee,
  Bike, Car, Plane, Gift, Crown, Diamond
} from 'lucide-react';

type GameIcon = {
  icon: React.ReactNode;
  name: string;
};

type Square = number | null;
type Board = Square[];
type GameMode = 'single' | 'multi' | null;
type GameState = 'selecting-mode' | 'selecting-difficulty' | 'selecting-icon-1' | 'selecting-icon-2' | 'playing';
type Difficulty = 'easy' | 'hard' | null;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const ICON_POOL: GameIcon[] = [
  { icon: <Dog size={32} />, name: 'Dog' },
  { icon: <Cat size={32} />, name: 'Cat' },
  { icon: <Fish size={32} />, name: 'Fish' },
  { icon: <Bird size={32} />, name: 'Bird' },
  { icon: <Flower2 size={32} />, name: 'Flower' },
  { icon: <Tree size={32} />, name: 'Tree' },
  { icon: <Snowflake size={32} />, name: 'Snowflake' },
  { icon: <Sun size={32} />, name: 'Sun' },
  { icon: <Cloud size={32} />, name: 'Cloud' },
  { icon: <Star size={32} />, name: 'Star' },
  { icon: <Trophy size={32} />, name: 'Trophy' },
  { icon: <Bath size={32} />, name: 'Bath' },
  { icon: <Heart size={32} />, name: 'Heart' },
  { icon: <Music size={32} />, name: 'Music' },
  { icon: <Gamepad2 size={32} />, name: 'Game' },
  { icon: <Rocket size={32} />, name: 'Rocket' },
  { icon: <Pizza size={32} />, name: 'Pizza' },
  { icon: <Coffee size={32} />, name: 'Coffee' },
  { icon: <Bike size={32} />, name: 'Bike' },
  { icon: <Car size={32} />, name: 'Car' },
  { icon: <Plane size={32} />, name: 'Plane' },
  { icon: <Gift size={32} />, name: 'Gift' },
  { icon: <Crown size={32} />, name: 'Crown' },
  { icon: <Diamond size={32} />, name: 'Diamond' },
];

function generateGameIcons(): GameIcon[] {
  const baseIcons: GameIcon[] = [
    { icon: <X size={32} />, name: 'X' },
    { icon: <Circle size={32} />, name: 'O' },
  ];
  
  const randomIcons = shuffleArray(ICON_POOL).slice(0, 6);
  
  return [...baseIcons, ...randomIcons];
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const STRATEGIC_POSITIONS = [
  4,  // Center
  0, 2, 6, 8,  // Corners
  1, 3, 5, 7   // Edges
];

function Confetti() {
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
      '#FFD93D', '#6C5CE7', '#A8E6CF', '#FF8B94'
    ];

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pieces = Array.from({ length: 150 }, (_, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = (Math.random() * Math.PI * 2);
      const distance = 100 + Math.random() * 200;
      
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      const rotationAngle = Math.random() * 720;
      const scale = 0.5 + Math.random() * 1.5;

      return (
        <div
          key={i}
          className="confetti"
          style={{
            backgroundColor: color,
            width: '8px',
            height: '8px',
            position: 'fixed',
            left: `${centerX}px`,
            top: `${centerY}px`,
            transform: `translate(-50%, -50%)`,
            '--end-x': `${endX}px`,
            '--end-y': `${endY}px`,
            '--rotation': `${rotationAngle}deg`,
            '--scale': scale,
          } as React.CSSProperties}
        />
      );
    });

    setConfetti(pieces);

    const timer = setTimeout(() => setConfetti([]), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div ref={boardRef} className="confetti-container">{confetti}</div>
    </>
  );
}

function App() {
  const [gameIcons, setGameIcons] = useState<GameIcon[]>(generateGameIcons());
  const [gameState, setGameState] = useState<GameState>('selecting-mode');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isFirstPlayerNext, setIsFirstPlayerNext] = useState(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [player1Icon, setPlayer1Icon] = useState<number | null>(null);
  const [player2Icon, setPlayer2Icon] = useState<number | null>(null);
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const calculateWinner = (squares: Board): [Square, number[] | null] => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (squares[a] != null && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], combination];
      }
    }
    return [null, null];
  };

  const getAvailableMoves = (squares: Board): number[] => {
    return squares.reduce<number[]>((moves, square, index) => {
      if (square === null) moves.push(index);
      return moves;
    }, []);
  };

  const isWinningMove = (squares: Board, position: number, player: number): boolean => {
    const newBoard = [...squares];
    newBoard[position] = player;
    const [winner] = calculateWinner(newBoard);
    return winner === player;
  };

  const findWinningMove = (squares: Board, player: number): number | null => {
    const availableMoves = getAvailableMoves(squares);
    for (const move of availableMoves) {
      if (isWinningMove(squares, move, player)) {
        return move;
      }
    }
    return null;
  };

  const findStrategicMove = (squares: Board): number => {
    for (const position of STRATEGIC_POSITIONS) {
      if (squares[position] === null) {
        return position;
      }
    }
    return getAvailableMoves(squares)[0];
  };

  const makeComputerMove = () => {
    if (!player2Icon || isComputerThinking) return;

    setIsComputerThinking(true);
    const currentBoard = [...board];
    let movePosition: number | null = null;

    if (difficulty === 'hard') {
      movePosition = findWinningMove(currentBoard, player2Icon);

      if (movePosition === null && player1Icon !== null) {
        movePosition = findWinningMove(currentBoard, player1Icon);
      }

      if (movePosition === null) {
        movePosition = findStrategicMove(currentBoard);
      }
    } else {
      const availableMoves = getAvailableMoves(currentBoard);
      movePosition = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (movePosition !== null) {
      setTimeout(() => {
        const newBoard = [...currentBoard];
        newBoard[movePosition!] = player2Icon;
        setBoard(newBoard);
        setIsFirstPlayerNext(true);
        setIsComputerThinking(false);
      }, 500);
    }
  };

  useEffect(() => {
    const [winner] = calculateWinner(board);
    const isDraw = board.every(square => square !== null);
    
    if (gameMode === 'single' && !isFirstPlayerNext && !winner && !isDraw) {
      makeComputerMove();
    }
  }, [isFirstPlayerNext, gameMode, board]);

  const [winner, currentWinningLine] = calculateWinner(board);
  useEffect(() => {
    if (currentWinningLine) {
      setWinningLine(currentWinningLine);
      setShowConfetti(true);
    } else {
      setWinningLine(null);
      setShowConfetti(false);
    }
  }, [currentWinningLine]);

  const isDraw = !winner && board.every(square => square !== null);
  
  const status = winner 
    ? `Winner: ${winner !== null ? gameIcons[winner].name : ''}` 
    : isDraw 
    ? "It's a draw!" 
    : player1Icon !== null && player2Icon !== null
    ? `Next player: ${gameIcons[isFirstPlayerNext ? player1Icon : player2Icon].name}`
    : 'Game starting...';

  const handleClick = (index: number) => {
    if (
      board[index] !== null || 
      winner || 
      (!isFirstPlayerNext && gameMode === 'single') ||
      isComputerThinking
    ) return;

    const newBoard = board.slice();
    newBoard[index] = isFirstPlayerNext ? player1Icon : player2Icon;
    setBoard(newBoard);
    setIsFirstPlayerNext(!isFirstPlayerNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsFirstPlayerNext(true);
    setWinningLine(null);
    setShowConfetti(false);
    setIsComputerThinking(false);
  };

  const startNewGame = (mode: GameMode) => {
    setGameIcons(generateGameIcons());
    setGameMode(mode);
    if (mode === 'single') {
      setGameState('selecting-difficulty');
    } else {
      setGameState('selecting-icon-1');
    }
    setPlayer1Icon(null);
    setPlayer2Icon(null);
    resetGame();
  };

  const selectIcon = (iconIndex: number) => {
    if (gameState === 'selecting-icon-1') {
      setPlayer1Icon(iconIndex);
      if (gameMode === 'single') {
        const availableIcons = gameIcons.map((_, i) => i).filter(i => i !== iconIndex);
        const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
        setPlayer2Icon(randomIcon);
        setGameState('playing');
      } else {
        setGameState('selecting-icon-2');
      }
    } else if (gameState === 'selecting-icon-2' && iconIndex !== player1Icon) {
      setPlayer2Icon(iconIndex);
      setGameState('playing');
    }
  };

  if (gameState === 'selecting-mode') {
    return (
      <div className="min-h-screen bg-animate bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Tic Tac Toe</h1>
          <div className="space-y-4">
            <button
              onClick={() => startNewGame('single')}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors font-semibold text-base sm:text-lg"
            >
              Single Player
            </button>
            <button
              onClick={() => startNewGame('multi')}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 
                transition-colors font-semibold text-base sm:text-lg"
            >
              Two Players
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'selecting-difficulty') {
    return (
      <div className="min-h-screen bg-animate bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">Select Difficulty</h1>
          <p className="text-gray-600 mb-6 sm:mb-8">Choose how challenging you want the computer to be</p>
          <div className="space-y-4">
            <button
              onClick={() => {
                setDifficulty('easy');
                setGameState('selecting-icon-1');
              }}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                transition-colors font-semibold text-base sm:text-lg"
            >
              Easy Mode
            </button>
            <button
              onClick={() => {
                setDifficulty('hard');
                setGameState('selecting-icon-1');
              }}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 
                transition-colors font-semibold text-base sm:text-lg"
            >
              Hard Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'selecting-icon-1' || gameState === 'selecting-icon-2') {
    return (
      <div className="min-h-screen bg-animate bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">Choose Your Icon</h1>
          <p className="text-gray-600 mb-4 sm:mb-6">
            {gameState === 'selecting-icon-1' ? 'Player 1' : 'Player 2'}, select your icon
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
            {gameIcons.map((gameIcon, index) => (
              <button
                key={index}
                onClick={() => selectIcon(index)}
                disabled={index === player1Icon}
                className={`p-2 sm:p-4 rounded-lg border-2 transition-all
                  ${index === player1Icon 
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }
                  flex items-center justify-center`}
              >
                <div className="text-gray-700 transform scale-75 sm:scale-100">{gameIcon.icon}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animate bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {showConfetti && <Confetti />}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Tic Tac Toe</h1>
          <div className="text-gray-600">
            <span className="text-sm sm:text-base">
              {gameMode === 'single' ? `vs Computer (${difficulty === 'easy' ? 'Easy' : 'Hard'})` : 'Two Players'}
            </span>
          </div>
        </div>
        
        <div className="mb-4 text-lg sm:text-xl text-center font-semibold text-gray-700">
          {status}
        </div>

        <div className="game-board grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 aspect-square">
          {board.map((square, index) => (
            <button
              key={index}
              className={`aspect-square flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-lg 
                ${square === null && !winner ? 'hover:bg-gray-100' : ''} 
                ${winningLine?.includes(index) ? 'bg-green-100 winner-cell' : 'bg-white'} 
                border-2 border-gray-200 transition-colors
                ${isComputerThinking ? 'cursor-not-allowed' : ''}`}
              onClick={() => handleClick(index)}
              disabled={
                square !== null || 
                !!winner || 
                (!isFirstPlayerNext && gameMode === 'single') ||
                isComputerThinking
              }
            >
              <div className="transform scale-75 sm:scale-100">
                {square !== null && gameIcons[square].icon}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={resetGame}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
              transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            disabled={isComputerThinking}
          >
            <RotateCcw size={18} className="sm:scale-110" />
            Reset Game
          </button>
          
          <button
            onClick={() => {
              setGameState('selecting-mode');
              setGameMode(null);
              setDifficulty(null);
              setPlayer1Icon(null);
              setPlayer2Icon(null);
              resetGame();
            }}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
              transition-colors font-semibold text-sm sm:text-base"
            disabled={isComputerThinking}
          >
            Change Game Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;