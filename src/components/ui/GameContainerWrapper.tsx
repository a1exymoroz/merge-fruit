import { useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import GameOverLine from './GameOverLine';
import GlassBox from './GlassBox';
import { CandyCane } from './WinterDecorations';
import { DropZone } from '../containers';
import GameContainer from './GameContainer';
import { type FruitRenderData } from '../../hooks/useGamePhysics';
import { type FruitType } from '../../constants/gameConstants';
import type { TargetBooster } from '../../store';
import './GameContainerWrapper.css';
import {
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  CONTAINER_DEPTH_X,
  CONTAINER_DEPTH_Y,
  GAME_OVER_LINE_Y,
} from '../../constants/gameConstants';

interface GameContainerWrapperProps {
  fruits: FruitRenderData[];
  nextFruit: FruitType | null;
  onDrop: (x: number) => void;
  wearHats: boolean;
  showCandyCane: boolean;
  containerBackground: string;
  containerBorder: string;
  armedBooster: TargetBooster | null;
  onApplyBoosterAt: (x: number, y: number) => void;
}

function BoosterAimOverlay({
  booster,
  onApply,
}: {
  booster: TargetBooster;
  onApply: (x: number, y: number) => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    onApply(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className="booster-aim-overlay"
      onClick={handleClick}
      style={{
        top: `${CONTAINER_DEPTH_Y}px`,
        width: `${CONTAINER_WIDTH}px`,
        height: `${CONTAINER_HEIGHT}px`,
      }}
    >
      <span className="booster-aim-hint">
        {booster === 'bomb' ? t('booster.hintBomb') : t('booster.hintUpgrade')}
      </span>
    </div>
  );
}

function GameContainerWrapper({
  fruits,
  nextFruit,
  onDrop,
  wearHats,
  showCandyCane,
  containerBackground,
  containerBorder,
  armedBooster,
  onApplyBoosterAt,
}: GameContainerWrapperProps) {
  const outerWidth = CONTAINER_WIDTH + CONTAINER_DEPTH_X;
  const outerHeight = CONTAINER_HEIGHT + CONTAINER_DEPTH_Y;

  return (
    <div
      className="game-container-wrapper"
      style={{ width: `${outerWidth}px`, height: `${outerHeight}px` }}
    >
      {showCandyCane && <CandyCane className="jar-candy-cane" />}

      <GlassBox
        fw={CONTAINER_WIDTH}
        fh={CONTAINER_HEIGHT}
        dx={CONTAINER_DEPTH_X}
        dy={CONTAINER_DEPTH_Y}
        base={containerBackground}
        edge={containerBorder}
        layer="back"
      />

      <div
        className="game-field"
        style={{
          top: `${CONTAINER_DEPTH_Y}px`,
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
        }}
      >
        <GameOverLine yPosition={GAME_OVER_LINE_Y} />
        <DropZone
          onDrop={onDrop}
          nextFruit={nextFruit}
          height={GAME_OVER_LINE_Y}
          wearHat={wearHats}
        />
        <GameContainer fruits={fruits} wearHats={wearHats} />
      </div>

      <GlassBox
        fw={CONTAINER_WIDTH}
        fh={CONTAINER_HEIGHT}
        dx={CONTAINER_DEPTH_X}
        dy={CONTAINER_DEPTH_Y}
        base={containerBackground}
        edge={containerBorder}
        layer="front"
      />

      {armedBooster && <BoosterAimOverlay booster={armedBooster} onApply={onApplyBoosterAt} />}
    </div>
  );
}

export default GameContainerWrapper;
