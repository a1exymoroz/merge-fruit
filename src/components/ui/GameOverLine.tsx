import './GameOverLine.css';

interface GameOverLineProps {
  yPosition: number;
}

function GameOverLine({ yPosition }: GameOverLineProps) {
  return (
    <div className="game-over-line" style={{ top: `${yPosition}px` }}>
      <div className="line"></div>
    </div>
  );
}

export default GameOverLine;
