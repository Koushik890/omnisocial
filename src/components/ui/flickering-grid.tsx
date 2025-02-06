'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  maxOpacity?: number
  width?: number
  height?: number
  className?: string
  children?: React.ReactNode
  offset?: { x: number; y: number }
}

export const FlickeringGrid = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  maxOpacity = 0.2,
  width,
  height,
  className,
  children,
  offset = { x: 0, y: 0 },
  ...props
}: FlickeringGridProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const animationRef = React.useRef<number>()
  const lastFrameTimeRef = React.useRef<number>(0)
  const frameIntervalRef = React.useRef<number>(1000 / 2) // 2 FPS for a more subtle effect

  React.useEffect(() => {
    setMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      return { width: rect.width, height: rect.height }
    }

    const { width: canvasWidth, height: canvasHeight } = updateCanvasSize()
    const cellSize = squareSize + gridGap
    const cols = Math.ceil(canvasWidth / cellSize) + 1
    const rows = Math.ceil(canvasHeight / cellSize) + 1

    const drawSquare = (x: number, y: number, opacity: number) => {
      if (!ctx) return
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.rect(
        (x * cellSize + offset.x % cellSize + cellSize) % cellSize - cellSize + (x * cellSize),
        (y * cellSize + offset.y % cellSize + cellSize) % cellSize - cellSize + (y * cellSize),
        squareSize,
        squareSize
      )
      ctx.fill()
    }

    const animate = (timestamp: number) => {
      if (!ctx) return

      // Check if enough time has passed since the last frame
      const elapsed = timestamp - lastFrameTimeRef.current
      if (elapsed < frameIntervalRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Update last frame time
      lastFrameTimeRef.current = timestamp

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      for (let i = -1; i <= cols; i++) {
        for (let j = -1; j <= rows; j++) {
          const shouldFlicker = Math.random() < flickerChance
          const opacity = shouldFlicker ? Math.random() * maxOpacity : 0
          drawSquare(i, j, opacity)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(canvas)

    animate(performance.now())

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, squareSize, gridGap, flickerChance, color, maxOpacity, offset])

  return (
    <div className={cn('relative overflow-hidden bg-white', className)} {...props}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          width: width || '100%',
          height: height || '100%',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />
      <div className="relative z-10">{children}</div>
    </div>
  )
} 