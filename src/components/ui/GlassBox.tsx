import { useId } from 'react';

/**
 * The play area drawn as an open-topped glass box seen slightly from
 * above-left: a front face (where the fruits live), a receding top face that
 * reads as the box's mouth, and a right side wall — bright edges, highlights,
 * reflections. Purely decorative: the physics field stays the plain
 * `fw x fh` rectangle. Ported from the Android port's ui/game/GlassContainer.kt
 * (drawGlassBoxBack / drawGlassBoxFront).
 *
 * `layer="back"` paints everything behind the fruits; `layer="front"` paints
 * the near edges and reflections over them (pointer-events: none).
 *
 * All coordinates are in the outer box's own space: `(fw + dx) x (fh + dy)`.
 */

interface GlassBoxProps {
  fw: number;
  fh: number;
  dx: number;
  dy: number;
  /** Interior glass colour (theme container background). */
  base: string;
  /** Near-edge tint (theme container border). */
  edge: string;
  layer: 'back' | 'front';
}

// --- colour helpers -------------------------------------------------

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerp(a: string, b: string, t: number): string {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(ar, br)}, ${c(ag, bg)}, ${c(ab, bb)})`;
}
function rgba(hex: string, alpha: number): string {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const W = (a: number) => `rgba(255,255,255,${a})`;

export default function GlassBox({ fw, fh, dx, dy, base, edge, layer }: GlassBoxProps) {
  const uid = useId().replace(/:/g, '');

  // Front-face corners (offset down by the top-face depth).
  const fTL: [number, number] = [0, dy];
  const fTR: [number, number] = [fw, dy];
  const fBR: [number, number] = [fw, fh + dy];
  const fBL: [number, number] = [0, fh + dy];
  // Receding corners.
  const bTL: [number, number] = [dx, 0];
  const bTR: [number, number] = [fw + dx, 0];
  const bBR: [number, number] = [fw + dx, fh];

  const quad = (a: number[], b: number[], c: number[], d: number[]) =>
    `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`;

  const outerW = fw + dx;
  const outerH = fh + dy;

  const common = {
    width: outerW,
    height: outerH,
    viewBox: `0 0 ${outerW} ${outerH}`,
    style: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      pointerEvents: 'none' as const,
      overflow: 'visible' as const,
    },
  };

  if (layer === 'back') {
    // Inset opening (glass wall thickness at the rim).
    const ctr = [(fTL[0] + fTR[0] + bTR[0] + bTL[0]) / 4, (fTL[1] + fTR[1] + bTR[1] + bTL[1]) / 4];
    const inset = (p: number[], t: number): number[] => [
      p[0] + (ctr[0] - p[0]) * t,
      p[1] + (ctr[1] - p[1]) * t,
    ];
    const it = 0.12;

    return (
      <svg {...common} aria-hidden="true">
        <defs>
          <linearGradient
            id={`wall-${uid}`}
            gradientUnits="userSpaceOnUse"
            x1={fTR[0]}
            y1={fTR[1]}
            x2={bBR[0]}
            y2={bBR[1]}
          >
            <stop offset="0%" stopColor={lerp(base, '#4A7799', 0.5)} stopOpacity={0.92} />
            <stop offset="100%" stopColor={lerp(base, '#2F5674', 0.62)} stopOpacity={0.95} />
          </linearGradient>
          <linearGradient
            id={`mouth-${uid}`}
            gradientUnits="userSpaceOnUse"
            x1={fTL[0]}
            y1={fTL[1]}
            x2={bTR[0]}
            y2={bTR[1]}
          >
            <stop offset="0%" stopColor={W(0.6)} />
            <stop offset="100%" stopColor={W(0.18)} />
          </linearGradient>
          <linearGradient
            id={`face-${uid}`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={dy}
            x2={0}
            y2={fh + dy}
          >
            <stop offset="0%" stopColor={W(0.85)} />
            <stop offset="30%" stopColor={base} />
            <stop offset="100%" stopColor={lerp(base, '#AAC6DA', 0.22)} />
          </linearGradient>
        </defs>

        {/* Right side wall — darkest face. */}
        <path d={quad(fTR, bTR, bBR, fBR)} fill={`url(#wall-${uid})`} />
        {/* Top face (mouth) — lightest, most reflective. */}
        <path d={quad(fTL, fTR, bTR, bTL)} fill={`url(#mouth-${uid})`} />
        {/* Inset rim. */}
        <path
          d={quad(inset(fTL, it), inset(fTR, it), inset(bTR, it), inset(bTL, it))}
          fill={lerp(base, '#35617F', 0.16)}
        />
        {/* Front face fill. */}
        <path d={quad(fTL, fTR, fBR, fBL)} fill={`url(#face-${uid})`} />
        {/* Far edges — faint. */}
        <g stroke={W(0.28)} strokeWidth={1.5} fill="none">
          <path d={`M ${bTL[0]} ${bTL[1]} L ${bTR[0]} ${bTR[1]}`} />
          <path d={`M ${bTR[0]} ${bTR[1]} L ${bBR[0]} ${bBR[1]}`} />
          <path d={`M ${bBR[0]} ${bBR[1]} L ${fBR[0]} ${fBR[1]}`} />
        </g>
      </svg>
    );
  }

  // layer === 'front'
  const glow: [number, number] = [fw * 0.14, dy + fh * 0.06];
  const reflTop = dy + fh * 0.045;
  const reflBottom = dy + fh * 0.92;

  return (
    <svg {...common} aria-hidden="true">
      <defs>
        <linearGradient
          id={`floor-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={dy}
          x2={0}
          y2={fh + dy}
        >
          <stop offset="72%" stopColor="rgba(16,58,76,0)" />
          <stop offset="100%" stopColor="rgba(16,58,76,0.09)" />
        </linearGradient>
        <linearGradient
          id={`edge-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={fTL[0]}
          y1={fTL[1]}
          x2={fBR[0]}
          y2={fBR[1]}
        >
          <stop offset="0%" stopColor={W(0.95)} />
          <stop offset="50%" stopColor={rgba(lerp(edge, '#FFFFFF', 0.3), 0.4)} />
          <stop offset="100%" stopColor={W(0.6)} />
        </linearGradient>
        <radialGradient
          id={`glow-${uid}`}
          gradientUnits="userSpaceOnUse"
          cx={glow[0]}
          cy={glow[1]}
          r={fw * 0.4}
        >
          <stop offset="0%" stopColor={W(0.35)} />
          <stop offset="100%" stopColor={W(0)} />
        </radialGradient>
      </defs>

      {/* Shaded floor for depth. */}
      <path d={quad(fTL, fTR, fBR, fBL)} fill={`url(#floor-${uid})`} />
      {/* Long vertical reflections down the front glass. */}
      <line
        x1={fw * 0.11}
        y1={reflTop}
        x2={fw * 0.11}
        y2={reflBottom}
        stroke={W(0.22)}
        strokeWidth={fw * 0.05}
      />
      <line
        x1={fw * 0.2}
        y1={reflTop}
        x2={fw * 0.2}
        y2={reflBottom}
        stroke={W(0.13)}
        strokeWidth={fw * 0.02}
      />
      {/* Near edges — bright, uneven glass. */}
      <path
        d={quad(fTL, fTR, fBR, fBL)}
        fill="none"
        stroke={`url(#edge-${uid})`}
        strokeWidth={3.5}
      />
      {/* The near vertical corner + rim read as the cube edge. */}
      <line x1={fTR[0]} y1={fTR[1]} x2={fBR[0]} y2={fBR[1]} stroke={W(0.95)} strokeWidth={4} />
      <line x1={fTL[0]} y1={fTL[1]} x2={fTR[0]} y2={fTR[1]} stroke={W(0.95)} strokeWidth={4} />
      <line
        x1={fBL[0]}
        y1={fBL[1]}
        x2={fBR[0]}
        y2={fBR[1]}
        stroke={rgba(edge, 0.55)}
        strokeWidth={3}
      />
      <line x1={fTL[0]} y1={fTL[1]} x2={fBL[0]} y2={fBL[1]} stroke={W(0.55)} strokeWidth={2.5} />
      <line x1={fTR[0]} y1={fTR[1]} x2={bTR[0]} y2={bTR[1]} stroke={W(0.6)} strokeWidth={2} />
      <line x1={fTL[0]} y1={fTL[1]} x2={bTL[0]} y2={bTL[1]} stroke={W(0.5)} strokeWidth={2} />
      {/* Corner glow, top-left. */}
      <circle cx={glow[0]} cy={glow[1]} r={fw * 0.4} fill={`url(#glow-${uid})`} />
    </svg>
  );
}
