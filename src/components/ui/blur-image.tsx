'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
}

export function BlurImage({ src, alt, className, width = 200, height = 200, ...props }: BlurImageProps) {
    const [isLoading, setLoading] = useState(true)

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(
                className,
                'duration-700 ease-in-out',
                isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'
            )}
            onLoad={() => setLoading(false)}
            onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = '/placeholder-image.jpg'
            }}
            {...props}
        />
    )
} 