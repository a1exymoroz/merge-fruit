import { useMemo, type CSSProperties } from 'react';
import './WinterDecorations.css';

/**
 * Full-screen drifting snow, drawn behind everything on the game screen for the
 * winter skin. Mirrors the Android port's SnowLayer.
 */
export function SnowLayer() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        // Deterministic-ish pseudo-random from the index so it doesn't reshuffle.
        const rand = (n: number) => {
          const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        return {
          key: i,
          left: `${rand(1) * 100}%`,
          size: 2 + rand(2) * 5,
          duration: 8 + rand(3) * 10,
          delay: -rand(4) * 18,
          drift: `${(rand(5) - 0.5) * 40}px`,
          opacity: 0.4 + rand(6) * 0.5,
        };
      }),
    [],
  );

  return (
    <div className="snow-layer" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.key}
          className="snowflake"
          style={
            {
              left: f.left,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--drift': f.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** A candy cane image, drawn leaning above the jar for the winter skin. */
export function CandyCane({ className }: { className?: string }) {
  return (
    <img
      src="/candy_cane.png"
      alt=""
      aria-hidden="true"
      className={['candy-cane', className].filter(Boolean).join(' ')}
    />
  );
}
