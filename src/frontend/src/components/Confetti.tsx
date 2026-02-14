import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['text-rose-500', 'text-pink-500', 'text-red-500', 'text-rose-400', 'text-pink-400'];
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 30; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute animate-fall ${piece.color}`}
          style={{
            left: `${piece.x}vw`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--rotation-start': `${piece.rotation}deg`,
            '--rotation-end': `${piece.rotation + 360}deg`,
          } as React.CSSProperties}
        >
          <Heart className="h-6 w-6 fill-current" />
        </div>
      ))}
    </div>
  );
}
