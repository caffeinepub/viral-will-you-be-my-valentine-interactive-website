import { useEffect, useRef, useState, useCallback } from 'react';

// User-provided source reference: https://youtube.com/shorts/Zy02CEOqrR4?si=ULEbg8LDnjIwxoc3
// "Glue Song" by beabadoobee (sped up + pitched)
// Note: The audio file must be manually added to frontend/public/assets/audio/glue-song-sped-up-pitched.mp3

const MUSIC_ENABLED_KEY = 'valentine-music-enabled';
const LOAD_TIMEOUT_MS = 10000; // 10 seconds

type AudioStatus = 'loading' | 'ready' | 'error' | 'blocked' | 'playing' | 'paused';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gestureListenerRef = useRef<((e: Event) => void) | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(MUSIC_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  });
  const [status, setStatus] = useState<AudioStatus>('loading');
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  // Attempt to play audio
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      setStatus('playing');
      setNeedsUserGesture(false);
      return true;
    } catch (error) {
      if ((error as Error).name === 'NotAllowedError') {
        setStatus('blocked');
        setNeedsUserGesture(true);
        return false;
      } else {
        console.warn('Audio play error:', error);
        setStatus('error');
        return false;
      }
    }
  }, []);

  // Remove gesture listener
  const removeGestureListener = useCallback(() => {
    if (gestureListenerRef.current) {
      ['pointerdown', 'touchend', 'keydown'].forEach(eventType => {
        document.removeEventListener(eventType, gestureListenerRef.current!);
      });
      gestureListenerRef.current = null;
    }
  }, []);

  // Register gesture listener for autoplay recovery
  const registerGestureListener = useCallback(() => {
    // Remove any existing listener first
    removeGestureListener();

    const listener = async (e: Event) => {
      const success = await attemptPlay();
      if (success) {
        removeGestureListener();
      }
    };

    gestureListenerRef.current = listener;
    ['pointerdown', 'touchend', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, listener, { once: false });
    });
  }, [attemptPlay, removeGestureListener]);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/assets/audio/glue-song-sped-up-pitched.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      
      // Multiple readiness signals
      const handleReady = () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        setStatus('ready');
      };

      audio.addEventListener('canplay', handleReady);
      audio.addEventListener('loadeddata', handleReady);
      audio.addEventListener('canplaythrough', handleReady);

      // Error handling
      audio.addEventListener('error', (e) => {
        console.warn('Audio failed to load:', e);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        setStatus('error');
      });

      // Load timeout
      loadTimeoutRef.current = setTimeout(() => {
        if (audio.readyState < 2) { // HAVE_CURRENT_DATA
          console.warn('Audio load timeout');
          setStatus('error');
        }
      }, LOAD_TIMEOUT_MS);

      audioRef.current = audio;
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      removeGestureListener();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [removeGestureListener]);

  // Handle play/pause based on enabled state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || status === 'loading' || status === 'error') return;

    const handlePlayback = async () => {
      if (isEnabled) {
        const success = await attemptPlay();
        if (!success && status === 'blocked') {
          // Register listener for next user gesture
          registerGestureListener();
        }
      } else {
        audio.pause();
        setStatus('paused');
        setNeedsUserGesture(false);
        removeGestureListener();
      }
    };

    handlePlayback();
  }, [isEnabled, status, attemptPlay, registerGestureListener, removeGestureListener]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem(MUSIC_ENABLED_KEY, String(isEnabled));
  }, [isEnabled]);

  const toggle = useCallback(async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
  }, [isEnabled]);

  // Imperative play action for UI prompt
  const playNow = useCallback(async () => {
    if (!isEnabled) {
      setIsEnabled(true);
    }
    const success = await attemptPlay();
    if (success) {
      removeGestureListener();
    }
  }, [isEnabled, attemptPlay, removeGestureListener]);

  // Derive user-friendly status text
  const getStatusText = (): string => {
    switch (status) {
      case 'loading':
        return 'Loading audio...';
      case 'error':
        return 'Audio failed to load';
      case 'blocked':
        return 'Tap to enable sound';
      case 'playing':
        return 'Music playing';
      case 'paused':
        return 'Music paused';
      case 'ready':
        return isEnabled ? 'Ready to play' : 'Music off';
      default:
        return '';
    }
  };

  return {
    isEnabled,
    toggle,
    playNow,
    needsUserGesture,
    status,
    statusText: getStatusText(),
    isReady: status !== 'loading' && status !== 'error'
  };
}
