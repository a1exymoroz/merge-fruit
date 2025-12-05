import { useEffect, type RefObject, type MutableRefObject, type Dispatch, type SetStateAction } from 'react'
import Matter from 'matter-js'
import { 
  FRUIT_TYPES, 
  CONTAINER_WIDTH, 
  CONTAINER_HEIGHT, 
  CONTAINER_THICKNESS,
  GAME_OVER_LINE_Y,
  UPDATE_INTERVAL,
  GAME_OVER_DELAY,
  type FruitType
} from '../constants/gameConstants'

export interface FruitData {
  fruitType: FruitType
  uniqueId: number
}

export interface FruitRenderData {
  body: Matter.Body
  fruitType: FruitType
  uniqueId: number
  x: number
  y: number
  angle: number
}

export interface UseGamePhysicsParams {
  fruitsRef: RefObject<Map<Matter.Body, FruitData>>
  setFruits: (fruits: FruitRenderData[]) => void
  setScore: Dispatch<SetStateAction<number>>
  gameOver: boolean
  setGameOver: Dispatch<SetStateAction<boolean>>
  gameOverTimer: ReturnType<typeof setTimeout> | null
  setGameOverTimer: Dispatch<SetStateAction<ReturnType<typeof setTimeout> | null>>
  highScore: number
  setHighScore: Dispatch<SetStateAction<number>>
  mergeQueueRef: RefObject<Set<string>>
  createFruit: (fruitType: FruitType, x: number, y: number) => void
  engineRef: MutableRefObject<Matter.Engine | null>
  runnerRef: MutableRefObject<Matter.Runner | null>
}

export function useGamePhysics({
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
}: UseGamePhysicsParams): void {
  useEffect(() => {
    // Initialize physics engine
    const engine = Matter.Engine.create()
    if (engine.world.gravity) {
      engine.world.gravity.y = 0.8
      engine.world.gravity.x = 0 // No horizontal gravity
    }
    engineRef.current = engine

    // Create container walls
    const walls = [
      // Bottom
      Matter.Bodies.rectangle(
        CONTAINER_WIDTH / 2, 
        CONTAINER_HEIGHT + CONTAINER_THICKNESS / 2, 
        CONTAINER_WIDTH, 
        CONTAINER_THICKNESS, 
        { isStatic: true, label: 'bottom' }
      ),
      // Left
      Matter.Bodies.rectangle(
        -CONTAINER_THICKNESS / 2, 
        CONTAINER_HEIGHT / 2, 
        CONTAINER_THICKNESS, 
        CONTAINER_HEIGHT, 
        { isStatic: true, label: 'left' }
      ),
      // Right
      Matter.Bodies.rectangle(
        CONTAINER_WIDTH + CONTAINER_THICKNESS / 2, 
        CONTAINER_HEIGHT / 2, 
        CONTAINER_THICKNESS, 
        CONTAINER_HEIGHT, 
        { isStatic: true, label: 'right' }
      ),
    ]

    Matter.World.add(engine.world, walls)

    // Game loop
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    runnerRef.current = runner

    // Handle collisions
    Matter.Events.on(engine, 'collisionStart', (event: { pairs: Array<{ bodyA: Matter.Body; bodyB: Matter.Body }> }) => {
      const pairs = event.pairs

      pairs.forEach((pair: { bodyA: Matter.Body; bodyB: Matter.Body }) => {
        const { bodyA, bodyB } = pair
        const fruitA = fruitsRef.current?.get(bodyA)
        const fruitB = fruitsRef.current?.get(bodyB)

        if (fruitA && fruitB && 
            fruitA.fruitType.id === fruitB.fruitType.id && 
            fruitA.fruitType.id < FRUIT_TYPES.length) {
          // Check if this merge is already queued
          const mergeKey = `${Math.min(fruitA.uniqueId, fruitB.uniqueId)}-${Math.max(fruitA.uniqueId, fruitB.uniqueId)}`
          if (mergeQueueRef.current?.has(mergeKey)) return

          mergeQueueRef.current?.add(mergeKey)

          // Remove both fruits
          Matter.World.remove(engine.world, [bodyA, bodyB])
          fruitsRef.current?.delete(bodyA)
          fruitsRef.current?.delete(bodyB)

          // Create merged fruit - INSTANTANEOUS merge
          const nextFruitType = FRUIT_TYPES.find(f => f.id === fruitA.fruitType.id + 1)
          if (nextFruitType) {
            const mergeX = (bodyA.position.x + bodyB.position.x) / 2
            const mergeY = (bodyA.position.y + bodyB.position.y) / 2
            
            // Calculate average velocity for chain reactions
            const velocityA = (bodyA as any).velocity || { x: 0, y: 0 }
            const velocityB = (bodyB as any).velocity || { x: 0, y: 0 }
            const avgVelocityX = (velocityA.x + velocityB.x) / 2
            const avgVelocityY = (velocityA.y + velocityB.y) / 2

            // Instantaneous merge - create immediately (no delay)
            createFruit(nextFruitType, mergeX, mergeY)
            setScore((prev: number) => prev + nextFruitType.points)
            
            // Apply velocity to the new fruit for chain reactions
            // Use requestAnimationFrame to ensure body is created before accessing
            requestAnimationFrame(() => {
              const allBodies: Matter.Body[] = Array.from(fruitsRef.current?.keys() || [])
              const newBody = allBodies.find(
                (b: Matter.Body) => {
                  const dx = Math.abs(b.position.x - mergeX)
                  const dy = Math.abs(b.position.y - mergeY)
                  return dx < 5 && dy < 5
                }
              )
              if (newBody) {
                const bodyAny = newBody as any
                if (!bodyAny.velocity) {
                  bodyAny.velocity = { x: 0, y: 0 }
                }
                bodyAny.velocity.x = avgVelocityX
                bodyAny.velocity.y = avgVelocityY
              }
              
              // Remove from queue after short delay
              setTimeout(() => {
                mergeQueueRef.current?.delete(mergeKey)
              }, 50)
            })
          } else {
            mergeQueueRef.current?.delete(mergeKey)
          }
        }
      })
    })

    // Update fruit positions for rendering
    const updatePositions = () => {
      if (gameOver) return

      const entries: Array<[Matter.Body, FruitData]> = fruitsRef.current ? Array.from(fruitsRef.current.entries()) : []
      const fruitArray: FruitRenderData[] = entries.map(([body, data]) => ({
        body,
        fruitType: data.fruitType,
        uniqueId: data.uniqueId,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      }))

      setFruits(fruitArray)

      // Check for game over
      // Fruits are dropped at DROP_Y (50px) and fall down (y increases)
      // Game over line is at GAME_OVER_LINE_Y (100px) from top of container
      // The container starts below the drop zone, so we need to check if fruits
      // have actually entered the container and then stacked above the line
      let fruitAboveLine = false
      fruitsRef.current?.forEach((data: FruitData, body: Matter.Body) => {
        // Only check fruits that have fallen into the container area
        // The drop zone is 0-100px, container starts at 100px
        // So we only check fruits that are below the drop zone (y > GAME_OVER_LINE_Y)
        // and then check if they've stacked back up above the line
        const fruitCenterY = body.position.y
        const fruitTop = fruitCenterY - data.fruitType.radius
        
        // Fruit must have entered the container (fallen past the game over line)
        // Use a larger buffer (50px) to ensure fruit has actually entered play area
        // and account for bouncing/rolling behavior
        const hasEnteredContainer = fruitCenterY > GAME_OVER_LINE_Y + 50
        const isAboveLine = fruitTop < GAME_OVER_LINE_Y
        
        if (hasEnteredContainer && isAboveLine) {
          fruitAboveLine = true
        }
      })

      if (fruitAboveLine && !gameOver) {
        if (!gameOverTimer) {
          const timer = setTimeout(() => {
            setGameOver(true)
            Matter.Runner.stop(runner)
            
            // Update high score
            setScore((currentScore: number) => {
              if (currentScore > highScore) {
                const newHighScore = currentScore
                setHighScore(newHighScore)
                localStorage.setItem('fruitMergeHighScore', newHighScore.toString())
              }
              return currentScore
            })
          }, GAME_OVER_DELAY)
          setGameOverTimer(timer)
        }
      } else if (!fruitAboveLine && gameOverTimer) {
        clearTimeout(gameOverTimer)
        setGameOverTimer(null)
      }
    }

    const interval = setInterval(updatePositions, UPDATE_INTERVAL)

    return () => {
      clearInterval(interval)
      if (gameOverTimer) clearTimeout(gameOverTimer)
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
      if (engineRef.current) Matter.Engine.clear(engineRef.current)
    }
  }, [])
}

