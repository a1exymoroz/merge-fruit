import { HEALTH_URL } from '../config/api';

const WARM_UP_TIMEOUT_MS = 50_000;
export const COLD_START_THRESHOLD_MS = 10_000;

let warmUpPromise: Promise<boolean> | null = null;
let warmUpStartedAt: number | null = null;

async function pingHealth(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WARM_UP_TIMEOUT_MS);

  try {
    const response = await fetch(HEALTH_URL, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function warmUpWithRetry(): Promise<boolean> {
  while (!(await pingHealth())) {
    // Each attempt waits up to 50s; pause briefly before a fresh retry.
    await new Promise((resolve) => window.setTimeout(resolve, 1_000));
  }

  return true;
}

export function warmUpBackend(): Promise<boolean> {
  if (!warmUpPromise) {
    warmUpStartedAt = Date.now();
    warmUpPromise = warmUpWithRetry();
  }

  return warmUpPromise;
}

export function getWarmUpStartedAt(): number | null {
  return warmUpStartedAt;
}
