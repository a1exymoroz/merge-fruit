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

/** A striped candy cane, drawn above the jar for the winter skin. */
export function CandyCane({ className }: { className?: string }) {
  const w = 100;
  const h = 60;
  const thickness = h * 0.26;
  const d = [
    `M ${w * 0.14} ${h * 0.62}`,
    `Q ${w * 0.1} ${h * 0.16} ${w * 0.3} ${h * 0.16}`,
    `Q ${w * 0.44} ${h * 0.16} ${w * 0.46} ${h * 0.46}`,
    `M ${w * 0.3} ${h * 0.16}`,
    `Q ${w * 0.62} ${h * 0.2} ${w * 0.9} ${h * 0.78}`,
  ].join(' ');

  return (
    <svg
      className={['candy-cane', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="#E23B3B" strokeWidth={thickness} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={thickness}
        strokeLinecap="butt"
        strokeDasharray={`${thickness * 0.5} ${thickness * 0.8}`}
      />
    </svg>
  );
}
