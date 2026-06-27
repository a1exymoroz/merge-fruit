import { HEALTH_URL } from '../config/api';

let warmUpPromise: Promise<boolean> | null = null;

export function warmUpBackend(): Promise<boolean> {
  if (!warmUpPromise) {
    warmUpPromise = fetch(HEALTH_URL)
      .then((response) => response.ok)
      .catch(() => false);
  }

  return warmUpPromise;
}
