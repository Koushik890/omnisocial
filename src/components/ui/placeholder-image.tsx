'use client'

import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface PlaceholderImageProps {
  width?: number
  height?: number
  className?: string
}

export function PlaceholderImage({ width = 200, height = 200, className }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
        className
      )}
      style={{ width, height }}
    >
      <ImageIcon className="w-1/3 h-1/3 text-gray-400 dark:text-gray-600" />
    </div>
  )
} 