import { useEffect, useRef, useState } from 'react';

export function Confetti() {
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
    <div ref={boardRef} className="confetti-container">{confetti}</div>
  );
}