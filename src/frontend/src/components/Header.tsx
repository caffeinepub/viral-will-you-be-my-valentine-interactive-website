import { Heart, Music, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  musicEnabled?: boolean;
  onMusicToggle?: () => void;
}

export default function Header({ musicEnabled = true, onMusicToggle }: HeaderProps) {
  return (
    <header className="w-full py-6 px-4 relative z-20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400" style={{ fontFamily: "'Pacifico', cursive" }}>
            Valentine's Day
          </h2>
        </div>
        
        {onMusicToggle && (
          <Button
            onClick={onMusicToggle}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20"
            aria-label={musicEnabled ? 'Turn music off' : 'Turn music on'}
          >
            {musicEnabled ? (
              <Music className="h-5 w-5 text-rose-500" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
