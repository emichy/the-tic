# Modern Tic Tac Toe

A beautiful, responsive Tic Tac Toe game built with React, TypeScript, and Tailwind CSS. Features both single-player and multiplayer modes with customizable icons and difficulty levels.

![Game Preview](https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=1600)

## Features

- 🎮 **Two Game Modes**
  - Single Player vs Computer
  - Two Player Local Multiplayer

- 🤖 **AI Difficulty Levels**
  - Easy Mode: Random moves
  - Hard Mode: Strategic AI that blocks winning moves

- 🎨 **Customizable Icons**
  - Choose from a variety of Lucide icons for both players
  - Includes classic X's and O's plus fun alternatives

- ✨ **Modern UI/UX**
  - Responsive design that works on all devices
  - Beautiful animations and transitions
  - Victory celebration with confetti effect
  - Gradient animated background

- 🏗️ **Technical Features**
  - Built with React 18 and TypeScript
  - Styled with Tailwind CSS
  - Comprehensive test suite
  - Modern development setup with Vite

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/modern-tic-tac-toe.git
cd modern-tic-tac-toe
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to the provided local URL

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint code

## Game Rules

1. Players take turns placing their icons in empty squares
2. First player to get 3 of their icons in a row (horizontally, vertically, or diagonally) wins
3. If all squares are filled and no player has won, the game is a draw

### Single Player Mode

- Choose between Easy and Hard difficulty
- Easy: Computer makes random moves
- Hard: Computer plays strategically and will:
  - Take winning moves when available
  - Block player's winning moves
  - Make strategic moves using center and corners

### Two Player Mode

- Players take turns choosing their icons
- First player is randomly assigned X or O
- Players alternate turns until game ends

## Project Structure

```
src/
├── components/     # Reusable React components
├── tests/         # Test files
├── types/         # TypeScript type definitions
├── utils/         # Game logic and utilities
└── App.tsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev)
- Font by Google Fonts
- Built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/)