import { useState, useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { 
  GameHeader, 
  GameContainerWrapper, 
  GameInfo, 
  GameOverOverlay, 
  Instructions,
  Leaderboard
} from '../ui'
import type { LeaderboardRef } from '../ui/Leaderboard'
import { useGamePhysics, type FruitRenderData } from '../../hooks/useGamePhysics'
import { generateNextFruit } from '../../utils/fruitUtils'
import { type FruitType, CONTAINER_WIDTH, DROP_Y } from '../../constants/gameConstants'
import './MergeFruitGame.css'

function MergeFruitGame() {
  const fruitsRef = useRef<Map<Matter.Body, { fruitType: FruitType; uniqueId: number }>>(new Map())
  const [fruits, setFruits] = useState<FruitRenderData[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('fruitMergeHighScore') || '0', 10)
  })
  const [nextFruit, setNextFruit] = useState<FruitType | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameOverTimer, setGameOverTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const mergeQueueRef = useRef<Set<string>>(new Set())
  const engineRef = useRef<Matter.Engine | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const leaderboardRef = useRef<LeaderboardRef>(null)

  // Create fruit function
  const createFruit = (fruitType: FruitType, x: number, y: number) => {
    if (!engineRef.current) return

    const body = Matter.Bodies.circle(x, y, fruitType.radius, {
      restitution: 0.4,
      friction: 0.6,
      frictionAir: 0.01,
      density: 0.001,
      frictionStatic: 0.8,
    })

    const uniqueId = Date.now() + Math.random()
    Matter.World.add(engineRef.current.world, body)
    fruitsRef.current.set(body, { fruitType, uniqueId })
  }

  // Initialize physics - pass refs so hook can set them
  useGamePhysics({
    fruitsRef,
    setFruits,
    setScore,
    gameOver,
    setGameOver,
    gameOverTimer,
    setGameOverTimer,
    highScore,
    setHighScore,
    mergeQueueRef,
    createFruit,
    engineRef,
    runnerRef,
  })

  // Initialize next fruit
  useEffect(() => {
    if (!nextFruit) {
      setNextFruit(generateNextFruit())
    }
  }, [nextFruit])

  const dropFruit = (x: number) => {
    if (gameOver || !nextFruit || !engineRef.current) return

    const clampedX = Math.max(nextFruit.radius, Math.min(CONTAINER_WIDTH - nextFruit.radius, x))
    createFruit(nextFruit, clampedX, DROP_Y)
    setNextFruit(generateNextFruit())
  }

  const resetGame = () => {
    if (!engineRef.current || !runnerRef.current) return

    // Clear all fruits
    const bodiesToRemove = Array.from(fruitsRef.current.keys())
    if (bodiesToRemove.length > 0) {
      Matter.World.remove(engineRef.current.world, bodiesToRemove)
    }
    fruitsRef.current.clear()
    mergeQueueRef.current.clear()
    setFruits([])

    setScore(0)
    setGameOver(false)
    if (gameOverTimer) {
      clearTimeout(gameOverTimer)
      setGameOverTimer(null)
    }

    // Restart runner
    Matter.Runner.run(runnerRef.current, engineRef.current)
  }

  return (
    <div className="merge-fruit-game">
      <GameHeader score={score} highScore={highScore} />
      <GameContainerWrapper fruits={fruits} nextFruit={nextFruit} onDrop={dropFruit} />
      <GameInfo nextFruit={nextFruit} onReset={resetGame} />
      {gameOver && (
        <GameOverOverlay 
          score={score} 
          highScore={highScore} 
          onPlayAgain={resetGame}
          onScoreSubmitted={() => leaderboardRef.current?.refresh()}
        />
      )}
      <Instructions />
      <Leaderboard ref={leaderboardRef} />
    </div>
  )
}

export default MergeFruitGame

