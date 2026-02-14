import { useEffect, useRef, useState } from 'react';

// User-provided source reference: https://youtube.com/shorts/Zy02CEOqrR4?si=ULEbg8LDnjIwxoc3
// "Glue Song" by beabadoobee (sped up + pitched)
// Note: The audio file must be manually added to frontend/public/assets/audio/glue-song-sped-up-pitched.mp3

const MUSIC_ENABLED_KEY = 'valentine-music-enabled';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(MUSIC_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  });
  const [isReady, setIsReady] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/assets/audio/glue-song-sped-up-pitched.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        setIsReady(true);
      });

      audio.addEventListener('error', (e) => {
        console.warn('Audio failed to load:', e);
      });

      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Handle play/pause based on enabled state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    const attemptPlay = async () => {
      if (isEnabled) {
        try {
          await audio.play();
          setNeedsUserGesture(false);
        } catch (error) {
          // Autoplay blocked - needs user gesture
          if ((error as Error).name === 'NotAllowedError') {
            setNeedsUserGesture(true);
          }
        }
      } else {
        audio.pause();
      }
    };

    attemptPlay();
  }, [isEnabled, isReady]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem(MUSIC_ENABLED_KEY, String(isEnabled));
  }, [isEnabled]);

  const toggle = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    // If turning on and needs gesture, try to play immediately
    if (newState && audioRef.current && isReady) {
      try {
        await audioRef.current.play();
        setNeedsUserGesture(false);
      } catch (error) {
        // Still blocked, but state is updated
        if ((error as Error).name === 'NotAllowedError') {
          setNeedsUserGesture(true);
        }
      }
    }
  };

  return {
    isEnabled,
    toggle,
    needsUserGesture,
    isReady
  };
}
