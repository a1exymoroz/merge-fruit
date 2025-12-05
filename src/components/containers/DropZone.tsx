import React, { useState, useEffect, useRef } from 'react'
import { type FruitType } from '../../constants/gameConstants'
import { CONTAINER_WIDTH } from '../../constants/gameConstants'
import Fruit from '../ui/Fruit'
import './DropZone.css'

interface DropZoneProps {
  onDrop: (x: number) => void
  nextFruit: FruitType | null
  height: number
}

function DropZone({ onDrop, nextFruit, height }: DropZoneProps) {
  const [dropPosition, setDropPosition] = useState(CONTAINER_WIDTH / 2)
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current) return
    
    const rect = dropZoneRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clampedX = Math.max(nextFruit?.radius || 0, Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), x))
    setDropPosition(clampedX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current) return
    
    const touch = e.touches[0]
    const rect = dropZoneRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const clampedX = Math.max(nextFruit?.radius || 0, Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), x))
    setDropPosition(clampedX)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      onDrop(dropPosition)
      setIsDragging(false)
    }
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      onDrop(dropPosition)
      setIsDragging(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onDrop(dropPosition)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setDropPosition(prev => Math.max(nextFruit?.radius || 0, prev - 10))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setDropPosition(prev => Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), prev + 10))
    }
  }

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        onDrop(dropPosition)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setDropPosition(prev => Math.max(nextFruit?.radius || 0, prev - 10))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setDropPosition(prev => Math.min(CONTAINER_WIDTH - (nextFruit?.radius || 0), prev + 10))
      }
    }

    window.addEventListener('keydown', handleGlobalKeyPress)
    return () => window.removeEventListener('keydown', handleGlobalKeyPress)
  }, [dropPosition, onDrop, nextFruit])

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
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="drop-indicator">
        <div className="drop-instructions">
          {isDragging ? 'Release to Drop' : 'Move to Position • Click/Space to Drop'}
        </div>
        {nextFruit && (
          <div 
            className="drop-preview"
            style={{ left: `${dropPosition - nextFruit.radius}px` }}
          >
            <div className="drop-shadow">
              <Fruit fruit={nextFruit} size={nextFruit.radius * 2} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DropZone
