import { useState, useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import {
  GameHeader,
  GameContainerWrapper,
  GameInfo,
  GameOverOverlay,
  Instructions,
  Leaderboard,
  BoosterBar,
  FruitProgressBar,
} from '../ui';
import { SnowLayer } from '../ui/WinterDecorations';
import { useAuth } from '../../contexts/AuthContext';
import { useGamePhysics, type FruitData, type FruitRenderData } from '../../hooks/useGamePhysics';
import { generateNextFruit } from '../../utils/fruitUtils';
import { type FruitType, CONTAINER_WIDTH, DROP_Y } from '../../constants/gameConstants';
import { THEME_SPECS } from '../../constants/theme';
import {
  fetchScores,
  useAppDispatch,
  useAppSelector,
  selectHighScore,
  selectNextFruit,
  selectArmedBooster,
  selectLargestFruitId,
  selectTheme,
  setNextFruit,
  armBooster,
  disarmBooster,
  consumeArmedBooster,
  swapNextFruit,
  holdNextFruit,
  reportLargestFruit,
  resetGame as resetGameAction,
  type TargetBooster,
} from '../../store';
import './MergeFruitGame.css';

function MergeFruitGame() {
  const dispatch = useAppDispatch();
  const { isGuest } = useAuth();
  const highScore = useAppSelector(selectHighScore);
  const nextFruit = useAppSelector(selectNextFruit);
  const armedBooster = useAppSelector(selectArmedBooster);
  const largestFruitId = useAppSelector(selectLargestFruitId);
  const theme = useAppSelector(selectTheme);
  const spec = THEME_SPECS[theme];

  const fruitsRef = useRef<Map<Matter.Body, FruitData>>(new Map());
  const [fruits, setFruits] = useState<FruitRenderData[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverTimer, setGameOverTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const mergeQueueRef = useRef<Set<string>>(new Set());
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const largestRef = useRef(1);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!isGuest) {
      dispatch(fetchScores());
    }
  }, [dispatch, isGuest]);

  useEffect(() => {
    if (!nextFruit) {
      dispatch(setNextFruit(generateNextFruit()));
    }
  }, [nextFruit, dispatch]);

  const createFruit = useCallback((fruitType: FruitType, x: number, y: number) => {
    if (!engineRef.current) return;

    const body = Matter.Bodies.circle(x, y, fruitType.radius, {
      restitution: 0.4,
      friction: 0.6,
      frictionAir: 0.01,
      density: 0.001,
      frictionStatic: 0.8,
    });

    const uniqueId = Date.now() + Math.random();
    Matter.World.add(engineRef.current.world, body);
    // createdAt drives the game-over grace period in useGamePhysics (see GAME_OVER_GRACE_MS).
    fruitsRef.current.set(body, { fruitType, uniqueId, createdAt: Date.now() });
  }, []);

  // Track the largest fruit reached this run for the evolution progress bar.
  const handleFruits = useCallback(
    (arr: FruitRenderData[]) => {
      setFruits(arr);
      let max = largestRef.current;
      for (const f of arr) if (f.fruitType.id > max) max = f.fruitType.id;
      if (max > largestRef.current) {
        largestRef.current = max;
        dispatch(reportLargestFruit(max));
      }
    },
    [dispatch],
  );

  const { removeFruitAt, upgradeFruitAt } = useGamePhysics({
    fruitsRef,
    setFruits: handleFruits,
    setScore,
    gameOver,
    setGameOver,
    gameOverTimer,
    setGameOverTimer,
    mergeQueueRef,
    createFruit,
    engineRef,
    runnerRef,
  });

  const dropFruit = (x: number) => {
    if (gameOver || armedBooster || !nextFruit || !engineRef.current) return;

    const clampedX = Math.max(nextFruit.radius, Math.min(CONTAINER_WIDTH - nextFruit.radius, x));
    createFruit(nextFruit, clampedX, DROP_Y);
    dispatch(setNextFruit(generateNextFruit()));
  };

  const toggleBooster = (booster: TargetBooster) => {
    if (gameOver) return;
    dispatch(armBooster(booster));
  };

  const applyBoosterAt = (x: number, y: number) => {
    if (!armedBooster) return;
    const hit = armedBooster === 'bomb' ? removeFruitAt(x, y) : upgradeFruitAt(x, y);
    dispatch(hit ? consumeArmedBooster() : disarmBooster());
  };

  const swapNext = () => {
    if (gameOver) return;
    dispatch(swapNextFruit(generateNextFruit()));
  };

  const holdFruit = () => {
    if (gameOver) return;
    dispatch(holdNextFruit(generateNextFruit()));
  };

  const resetGame = () => {
    if (!engineRef.current || !runnerRef.current) return;

    const bodiesToRemove = Array.from(fruitsRef.current.keys());
    if (bodiesToRemove.length > 0) {
      Matter.World.remove(engineRef.current.world, bodiesToRemove);
    }
    fruitsRef.current.clear();
    mergeQueueRef.current.clear();
    setFruits([]);

    setScore(0);
    setGameOver(false);
    if (gameOverTimer) {
      clearTimeout(gameOverTimer);
      setGameOverTimer(null);
    }
    largestRef.current = 1;
    dispatch(resetGameAction(generateNextFruit()));

    Matter.Runner.run(runnerRef.current, engineRef.current);
  };

  return (
    <div className={`merge-fruit-game merge-fruit-game--${theme}`}>
      {spec.showSnow && <SnowLayer />}
      <GameHeader
        score={score}
        highScore={highScore}
        nextFruit={nextFruit}
        wearHats={spec.wearHats}
      />
      <BoosterBar
        gameOver={gameOver}
        armedBooster={armedBooster}
        wearHats={spec.wearHats}
        onToggleBooster={toggleBooster}
        onSwap={swapNext}
        onHold={holdFruit}
      />
      <GameContainerWrapper
        fruits={fruits}
        nextFruit={nextFruit}
        onDrop={dropFruit}
        wearHats={spec.wearHats}
        showCandyCane={spec.showCandyCane}
        containerBackground={spec.containerBackground}
        containerBorder={spec.containerBorder}
        armedBooster={armedBooster}
        onApplyBoosterAt={applyBoosterAt}
      />
      <FruitProgressBar largestFruitId={largestFruitId} wearHats={spec.wearHats} />
      <GameInfo onReset={resetGame} />
      {gameOver && <GameOverOverlay score={score} highScore={highScore} onPlayAgain={resetGame} />}
      <Instructions />
      {!isGuest && <Leaderboard />}
    </div>
  );
}

export default MergeFruitGame;
