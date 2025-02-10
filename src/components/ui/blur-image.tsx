'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from './placeholder-image'

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
}

export function BlurImage({ src, alt, className, width = 200, height = 200, ...props }: BlurImageProps) {
    const [isLoading, setLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return <PlaceholderImage width={width} height={height} className={className} />
    }

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
            onError={() => setHasError(true)}
            {...props}
        />
    )
} 