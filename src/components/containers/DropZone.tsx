import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type FruitType } from '../../constants/gameConstants';
import { CONTAINER_WIDTH } from '../../constants/gameConstants';
import Fruit from '../ui/Fruit';
import './DropZone.css';

interface DropZoneProps {
  onDrop: (x: number) => void;
  nextFruit: FruitType | null;
  height: number;
  /** Winter skin — the preview fruit wears a Santa hat. */
  wearHat?: boolean;
}

function DropZone({ onDrop, nextFruit, height, wearHat }: DropZoneProps) {
  const { t } = useTranslation();
  const [dropPosition, setDropPosition] = useState(CONTAINER_WIDTH / 2);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current) return;

    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(
      nextFruit?.radius || 0,
      Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), x),
    );
    setDropPosition(clampedX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current) return;

    const touch = e.touches[0];
    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const clampedX = Math.max(
      nextFruit?.radius || 0,
      Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), x),
    );
    setDropPosition(clampedX);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onDrop(dropPosition);
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current) return;

    const touch = e.touches[0];
    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const clampedX = Math.max(
      nextFruit?.radius || 0,
      Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), x),
    );
    setDropPosition(clampedX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent the browser from also firing synthetic mouse events
    // (mousedown/mouseup) after this touch, which would double-trigger onDrop.
    e.preventDefault();
    if (isDragging) {
      onDrop(dropPosition);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onDrop(dropPosition);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setDropPosition((prev) => Math.max(nextFruit?.radius || 0, prev - 10));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setDropPosition((prev) => Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), prev + 10));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [dropPosition, onDrop, nextFruit]);

  return (
    <div
      ref={dropZoneRef}
      className="drop-zone"
      style={{ top: '0px', height: `${height}px` }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="drop-indicator">
        <div className="drop-instructions">
          {isDragging ? t('game.releaseToDrop') : t('game.moveToPosition')}
        </div>
        {nextFruit && (
          <div className="drop-preview" style={{ left: `${dropPosition - nextFruit.radius}px` }}>
            <div className="drop-shadow">
              <Fruit fruit={nextFruit} size={nextFruit.radius * 2} wearHat={wearHat} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoized so it doesn't re-render on every physics tick (it doesn't depend
// on fruit positions, only onDrop/nextFruit/height).
export default React.memo(DropZone);
