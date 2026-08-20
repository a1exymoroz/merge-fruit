import { useEffect, useState } from 'react';
import {
  COLD_START_THRESHOLD_MS,
  getWarmUpStartedAt,
  warmUpBackend,
} from '../services/healthApi';

export function useColdStart(): boolean {
  const [isColdStart, setIsColdStart] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = getWarmUpStartedAt() ?? Date.now();
    const remaining = COLD_START_THRESHOLD_MS - (Date.now() - startedAt);

    const timeoutId = window.setTimeout(
      () => {
        if (!cancelled) setIsColdStart(true);
      },
      Math.max(remaining, 0),
    );

    warmUpBackend().then(() => {
      if (!cancelled) {
        window.clearTimeout(timeoutId);
        setIsColdStart(false);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return isColdStart;
}
