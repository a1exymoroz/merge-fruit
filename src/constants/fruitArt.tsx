function FruitLevelText({ level, stroke }: { level: number; stroke: string }) {
  return (
    <text
      x="50"
      y="50"
      fontSize="45"
      textAnchor="middle"
      dominantBaseline="central"
      fill="#ffffff"
      opacity={0.6}
      stroke={stroke}
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
      fontFamily="'Arial Black', sans-serif"
      fontWeight="bold"
    >
      {level}
    </text>
  );
}

export function renderFruitArt(id: number) {
  switch (id) {
    case 1:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#4a69bd" />
          <path
            d="M 20 40 Q 35 15 65 20"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 50 35 L 55 45 L 65 45 L 58 52 L 60 62 L 50 55 L 40 62 L 42 52 L 35 45 L 45 45 Z"
            fill="#1e3799"
          />
          <FruitLevelText level={1} stroke="#1e3799" />
        </>
      );
    case 2:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#e55039" />
          <ellipse
            cx="30"
            cy="30"
            rx="12"
            ry="6"
            fill="rgba(255,255,255,0.4)"
            transform="rotate(-45 30 30)"
          />
          <path d="M 50 15 Q 45 25 50 35" fill="none" stroke="#38ada9" strokeWidth="3" />
          <path d="M 50 15 Q 65 10 60 25 Q 45 30 50 15 Z" fill="#78e08f" />
          <FruitLevelText level={2} stroke="#b33939" />
        </>
      );
    case 3:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#8e44ad" />
          <circle cx="50" cy="50" r="40" fill="#f39c12" />
          <ellipse cx="50" cy="50" rx="14" ry="20" fill="#d35400" />
          <FruitLevelText level={3} stroke="#5e3370" />
        </>
      );
    case 4:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#f1c40f" />
          <circle cx="50" cy="50" r="40" fill="#fff9c4" />
          <circle cx="50" cy="50" r="37" fill="#f1c40f" />
          <line x1="50" y1="13" x2="50" y2="87" stroke="#fff9c4" strokeWidth="3" />
          <line x1="13" y1="50" x2="87" y2="50" stroke="#fff9c4" strokeWidth="3" />
          <line x1="24" y1="24" x2="76" y2="76" stroke="#fff9c4" strokeWidth="3" />
          <line x1="24" y1="76" x2="76" y2="24" stroke="#fff9c4" strokeWidth="3" />
          <FruitLevelText level={4} stroke="#e67e22" />
        </>
      );
    case 5:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#8d6e63" />
          <circle cx="50" cy="50" r="38" fill="#9ccc65" />
          <circle cx="50" cy="50" r="15" fill="#f4f1ea" />
          <circle cx="50" cy="30" r="2.5" fill="#2d3436" />
          <circle cx="50" cy="70" r="2.5" fill="#2d3436" />
          <circle cx="30" cy="50" r="2.5" fill="#2d3436" />
          <circle cx="70" cy="50" r="2.5" fill="#2d3436" />
          <circle cx="35" cy="35" r="2.5" fill="#2d3436" />
          <circle cx="65" cy="65" r="2.5" fill="#2d3436" />
          <circle cx="65" cy="35" r="2.5" fill="#2d3436" />
          <circle cx="35" cy="65" r="2.5" fill="#2d3436" />
          <FruitLevelText level={5} stroke="#558b2f" />
        </>
      );
    case 6:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#e67e22" />
          <circle cx="50" cy="50" r="40" fill="#fdf0d5" />
          <circle cx="50" cy="50" r="37" fill="#e67e22" />
          <line x1="50" y1="13" x2="50" y2="87" stroke="#fdf0d5" strokeWidth="3" />
          <line x1="13" y1="50" x2="87" y2="50" stroke="#fdf0d5" strokeWidth="3" />
          <line x1="24" y1="24" x2="76" y2="76" stroke="#fdf0d5" strokeWidth="3" />
          <line x1="24" y1="76" x2="76" y2="24" stroke="#fdf0d5" strokeWidth="3" />
          <FruitLevelText level={6} stroke="#d35400" />
        </>
      );
    case 7:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#e74c3c" />
          <circle cx="50" cy="50" r="40" fill="#fdf0d5" />
          <path d="M 50 35 Q 40 50 50 65 Q 60 50 50 35" fill="#f7e1b5" />
          <ellipse cx="45" cy="50" rx="3" ry="7" fill="#4a2311" transform="rotate(15 45 50)" />
          <ellipse cx="55" cy="50" rx="3" ry="7" fill="#4a2311" transform="rotate(-15 55 50)" />
          <FruitLevelText level={7} stroke="#c0392b" />
        </>
      );
    case 8:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#ff7675" />
          <circle cx="50" cy="50" r="41" fill="#ffeaa7" />
          <circle cx="50" cy="50" r="16" fill="#d63031" />
          <FruitLevelText level={8} stroke="#d63031" />
        </>
      );
    case 9:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#5D4037" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          <circle cx="50" cy="50" r="22" fill="#e0f7fa" />
          <FruitLevelText level={9} stroke="#3e2723" />
        </>
      );
    case 10:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#2ca181" />
          <circle cx="50" cy="50" r="42" fill="#d1ccc0" />
          <circle cx="50" cy="50" r="39" fill="#f39c12" />
          <circle cx="50" cy="50" r="20" fill="#e1b12c" />
          <ellipse cx="43" cy="43" rx="2" ry="4" fill="#f5f6fa" transform="rotate(45 43 43)" />
          <ellipse cx="57" cy="43" rx="2" ry="4" fill="#f5f6fa" transform="rotate(-45 57 43)" />
          <ellipse cx="50" cy="58" rx="2" ry="4" fill="#f5f6fa" transform="rotate(90 50 58)" />
          <FruitLevelText level={10} stroke="#1b7a61" />
        </>
      );
    case 11:
      return (
        <>
          <circle cx="50" cy="50" r="45" fill="#27ae60" />
          <circle cx="50" cy="50" r="40" fill="#ecf0f1" />
          <circle cx="50" cy="50" r="36" fill="#ff4757" />
          <ellipse cx="50" cy="25" rx="2.5" ry="5" fill="#2f3542" />
          <ellipse cx="25" cy="50" rx="2.5" ry="5" fill="#2f3542" transform="rotate(90 25 50)" />
          <ellipse cx="75" cy="50" rx="2.5" ry="5" fill="#2f3542" transform="rotate(90 75 50)" />
          <ellipse cx="50" cy="75" rx="2.5" ry="5" fill="#2f3542" />
          <FruitLevelText level={11} stroke="#1e8449" />
        </>
      );
    default:
      return null;
  }
}
