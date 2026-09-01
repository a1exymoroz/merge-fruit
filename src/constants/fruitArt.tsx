/**
 * Each fruit is a cute, face-bearing character: a soft radial-gradient body, a
 * glossy highlight, one distinguishing accent per fruit, and a kawaii face
 * (eyes, blush, smile). With `wearHat` it also gets a Santa hat for the winter
 * skin. Ported 1:1 from the Android port's ui/fruit/FruitArt.kt.
 *
 * Everything is drawn in the SVG's 0..100 space (see FruitSprite's viewBox) so
 * the same art works from the 22px progress strip up to the jar.
 */

// --- colour helpers ---------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
function mix(hex: string, other: [number, number, number], t: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r * (1 - t) + other[0] * t,
    g * (1 - t) + other[1] * t,
    b * (1 - t) + other[2] * t,
  );
}
const lighten = (hex: string, t: number) => mix(hex, [255, 255, 255], t);
const darken = (hex: string, t: number) => mix(hex, [0, 0, 0], t);

interface FruitPalette {
  body: string;
  accent: string;
}

const PALETTES: Record<number, FruitPalette> = {
  1: { body: '#5B7BE0', accent: '#2E3D8F' }, // Blueberry
  2: { body: '#E8503C', accent: '#3E7D2E' }, // Cherry
  3: { body: '#9B59B6', accent: '#6C3483' }, // Plum
  4: { body: '#F3CC2E', accent: '#6BA03B' }, // Lemon
  5: { body: '#A1887F', accent: '#8CB84E' }, // Kiwi
  6: { body: '#ED8A2B', accent: '#3E7D2E' }, // Orange
  7: { body: '#E84C3D', accent: '#4E8A34' }, // Apple
  8: { body: '#FFA36C', accent: '#E0685A' }, // Peach
  9: { body: '#A1887F', accent: '#EFE7DC' }, // Coconut
  10: { body: '#82C46B', accent: '#4F9E3F' }, // Melon
  11: { body: '#43A047', accent: '#2E6B31' }, // Watermelon
};

const paletteFor = (id: number): FruitPalette =>
  PALETTES[id] ?? { body: '#999999', accent: '#666666' };

// Drawing space: 0..100, matching FruitArt.kt (center 50/52, radius 44).
const CX = 50;
const CY = 52;
const R = 44;

// --- accent per fruit -----------------------------------------------

function renderAccent(id: number, palette: FruitPalette) {
  const { body, accent } = palette;
  switch (id) {
    case 1: // blueberry crown
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => {
            const a = ((i * 72 - 90) * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={CX + R * 0.16 * Math.cos(a)}
                cy={CY - R * 0.72 + R * 0.16 * Math.sin(a)}
                r={R * 0.09}
                fill={accent}
              />
            );
          })}
        </g>
      );
    case 2: // cherry stem + leaf
      return (
        <g>
          <line
            x1={CX}
            y1={CY - R * 0.9}
            x2={CX + R * 0.28}
            y2={CY - R * 1.45}
            stroke="#6B4A2B"
            strokeWidth={R * 0.1}
            strokeLinecap="round"
          />
          <ellipse
            cx={CX + R * 0.22 + R * 0.275}
            cy={CY - R * 1.7 + R * 0.16}
            rx={R * 0.275}
            ry={R * 0.16}
            fill={accent}
          />
        </g>
      );
    case 3: // plum crease
      return (
        <line
          x1={CX}
          y1={CY - R * 0.9}
          x2={CX}
          y2={CY + R * 0.9}
          stroke={accent}
          strokeOpacity={0.5}
          strokeWidth={R * 0.08}
        />
      );
    case 4: // lemon nubs
      return (
        <g fill={darken(body, 0.2)}>
          <circle cx={CX + R * 0.85} cy={CY} r={R * 0.12} />
          <circle cx={CX - R * 0.85} cy={CY} r={R * 0.12} />
        </g>
      );
    case 5: // kiwi cut core
      return (
        <g>
          <circle cx={CX} cy={CY} r={R * 0.66} fill="#9CCC65" />
          <circle cx={CX} cy={CY} r={R * 0.24} fill="#F3F0E4" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * 36 * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={CX + R * 0.42 * Math.cos(a)}
                cy={CY + R * 0.42 * Math.sin(a)}
                r={R * 0.045}
                fill="#2D3436"
              />
            );
          })}
        </g>
      );
    case 6: // orange navel
      return <circle cx={CX} cy={CY - R * 0.82} r={R * 0.1} fill={darken(body, 0.25)} />;
    case 7: // apple stem + leaf
      return (
        <g>
          <line
            x1={CX}
            y1={CY - R * 0.85}
            x2={CX}
            y2={CY - R * 1.3}
            stroke="#6B4A2B"
            strokeWidth={R * 0.12}
            strokeLinecap="round"
          />
          <ellipse
            cx={CX + R * 0.05 + R * 0.3}
            cy={CY - R * 1.35 + R * 0.17}
            rx={R * 0.3}
            ry={R * 0.17}
            fill={accent}
          />
        </g>
      );
    case 8: // peach crease
      return (
        <line
          x1={CX - R * 0.1}
          y1={CY - R * 0.85}
          x2={CX + R * 0.1}
          y2={CY + R * 0.85}
          stroke={accent}
          strokeOpacity={0.45}
          strokeWidth={R * 0.09}
        />
      );
    case 9: // coconut pale patch
      return <circle cx={CX + R * 0.15} cy={CY + R * 0.1} r={R * 0.5} fill={accent} />;
    case 10: // melon net
      return (
        <g stroke={accent} strokeOpacity={0.5} strokeWidth={R * 0.05}>
          {[-2, -1, 0, 1, 2].map((k) => (
            <line key={k} x1={CX + k * R * 0.32} y1={CY - R} x2={CX + k * R * 0.32} y2={CY + R} />
          ))}
        </g>
      );
    case 11: // watermelon stripes
      return (
        <g stroke={accent} strokeWidth={R * 0.14}>
          {[-2, -1, 0, 1, 2].map((k) => (
            <line
              key={k}
              x1={CX + k * R * 0.42}
              y1={CY - R * 0.95}
              x2={CX + k * R * 0.42}
              y2={CY + R * 0.95}
            />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function renderFace() {
  const eyeDx = R * 0.34;
  const eyeY = CY - R * 0.02;
  return (
    <g>
      {[-1, 1].map((sign) => (
        <g key={sign}>
          <circle cx={CX + sign * eyeDx} cy={eyeY} r={R * 0.14} fill="#2B2B2B" />
          <circle
            cx={CX + sign * eyeDx - R * 0.05}
            cy={eyeY - R * 0.05}
            r={R * 0.05}
            fill="#FFFFFF"
          />
          <ellipse
            cx={CX + sign * R * 0.62}
            cy={CY + R * 0.16 + R * 0.1}
            rx={R * 0.16}
            ry={R * 0.1}
            fill="#FF8FA3"
            fillOpacity={0.55}
          />
        </g>
      ))}
      {/* smile: 25°..155° arc across the lower face */}
      <path
        d={`M ${CX + R * 0.26 * Math.cos((25 * Math.PI) / 180)} ${
          CY + R * 0.02 + R * 0.2 + R * 0.2 * Math.sin((25 * Math.PI) / 180)
        } A ${R * 0.26} ${R * 0.2} 0 0 1 ${CX + R * 0.26 * Math.cos((155 * Math.PI) / 180)} ${
          CY + R * 0.02 + R * 0.2 + R * 0.2 * Math.sin((155 * Math.PI) / 180)
        }`}
        fill="none"
        stroke="#2B2B2B"
        strokeWidth={R * 0.07}
        strokeLinecap="round"
      />
    </g>
  );
}

function renderSantaHat() {
  const cone = [
    `M ${CX - R * 0.72} ${CY - R * 0.52}`,
    `Q ${CX - R * 0.15} ${CY - R * 1.55} ${CX + R * 0.6} ${CY - R * 0.98}`,
    `L ${CX + R * 0.64} ${CY - R * 0.34}`,
    `Q ${CX - R * 0.05} ${CY - R * 0.72} ${CX - R * 0.72} ${CY - R * 0.52}`,
    'Z',
  ].join(' ');
  return (
    <g transform={`rotate(-8 ${CX} ${CY})`}>
      <path d={cone} fill="#D32F2F" />
      <line
        x1={CX - R * 0.8}
        y1={CY - R * 0.46}
        x2={CX + R * 0.66}
        y2={CY - R * 0.3}
        stroke="#FFFFFF"
        strokeWidth={R * 0.26}
        strokeLinecap="round"
      />
      <circle cx={CX + R * 0.6} cy={CY - R * 1.02} r={R * 0.17} fill="#FFFFFF" />
    </g>
  );
}

/**
 * The full fruit drawing. `uid` must be unique per rendered sprite (it names the
 * body gradient); FruitSprite passes React's useId().
 */
export function renderFruitArt(id: number, uid: string, wearHat = false) {
  const palette = paletteFor(id);
  const gradId = `fruit-body-${uid}`;
  return (
    <>
      <defs>
        <radialGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          cx={CX - R * 0.35}
          cy={CY - R * 0.35}
          r={R * 1.5}
        >
          <stop offset="0%" stopColor={lighten(palette.body, 0.35)} />
          <stop offset="55%" stopColor={palette.body} />
          <stop offset="100%" stopColor={darken(palette.body, 0.22)} />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill={`url(#${gradId})`} />
      {renderAccent(id, palette)}
      <ellipse
        cx={CX - R * 0.55 + R * 0.35}
        cy={CY - R * 0.8 + R * 0.25}
        rx={R * 0.35}
        ry={R * 0.25}
        fill="#FFFFFF"
        fillOpacity={0.35}
      />
      {renderFace()}
      {wearHat && renderSantaHat()}
    </>
  );
}
