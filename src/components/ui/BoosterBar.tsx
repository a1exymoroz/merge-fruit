import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Fruit from './Fruit';
import {
  useAppSelector,
  selectBombs,
  selectUpgrades,
  selectSwaps,
  selectHolds,
  selectHeldFruit,
  type TargetBooster,
} from '../../store';
import './BoosterBar.css';

interface BoosterBarProps {
  gameOver: boolean;
  armedBooster: TargetBooster | null;
  wearHats: boolean;
  onToggleBooster: (booster: TargetBooster) => void;
  onSwap: () => void;
  onHold: () => void;
}

function BoosterButton({
  label,
  count,
  armed,
  enabled,
  onClick,
  children,
}: {
  label: string;
  count: number;
  armed: boolean;
  enabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`booster-button${armed ? ' booster-button--armed' : ''}`}
      disabled={!enabled}
      onClick={onClick}
      aria-pressed={armed}
    >
      <span className="booster-icon">{children}</span>
      <span className="booster-label">{label}</span>
      <span className="booster-count">×{count}</span>
    </button>
  );
}

function BoosterBar({
  gameOver,
  armedBooster,
  wearHats,
  onToggleBooster,
  onSwap,
  onHold,
}: BoosterBarProps) {
  const { t } = useTranslation();
  const bombs = useAppSelector(selectBombs);
  const upgrades = useAppSelector(selectUpgrades);
  const swaps = useAppSelector(selectSwaps);
  const holds = useAppSelector(selectHolds);
  const heldFruit = useAppSelector(selectHeldFruit);

  return (
    <div className="booster-bar">
      <BoosterButton
        label={t('booster.bomb')}
        count={bombs}
        armed={armedBooster === 'bomb'}
        enabled={!gameOver && bombs > 0}
        onClick={() => onToggleBooster('bomb')}
      >
        💣
      </BoosterButton>
      <BoosterButton
        label={t('booster.upgrade')}
        count={upgrades}
        armed={armedBooster === 'upgrade'}
        enabled={!gameOver && upgrades > 0}
        onClick={() => onToggleBooster('upgrade')}
      >
        ⬆️
      </BoosterButton>
      <BoosterButton
        label={t('booster.swap')}
        count={swaps}
        armed={false}
        enabled={!gameOver && swaps > 0}
        onClick={onSwap}
      >
        🔄
      </BoosterButton>
      <BoosterButton
        label={t('booster.hold')}
        count={holds}
        armed={false}
        enabled={!gameOver && holds > 0}
        onClick={onHold}
      >
        {heldFruit ? <Fruit fruit={heldFruit} size={22} wearHat={wearHats} /> : '📦'}
      </BoosterButton>
    </div>
  );
}

export default BoosterBar;
