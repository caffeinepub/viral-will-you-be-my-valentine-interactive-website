import { useActor } from './useActor';

// No backend queries needed for this static Valentine's experience
// All interactions are client-side only

export function useBackendHealth() {
  const { actor, isFetching } = useActor();
  
  return {
    isReady: !!actor && !isFetching,
    isFetching
  };
}
