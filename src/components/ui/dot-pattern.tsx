'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
}

export const DotPattern = ({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={cn('absolute inset-0 -z-10', className)}
      {...props}
    >
      <defs>
        <pattern
          id="dotPattern"
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} className="fill-black/[0.2]" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  )
} 