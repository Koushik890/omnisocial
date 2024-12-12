import { cn } from '@/lib/utils'
import React from 'react'
import { Spinner } from './spinner'

type LoaderProps = {
  state: boolean
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  overlay?: boolean
}

const Loader = ({ 
  children, 
  state, 
  className, 
  size = 'md',
  fullScreen = false,
  overlay = true
}: LoaderProps) => {
  if (!state) return <>{children}</>

  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'fixed inset-0 z-50': fullScreen,
      'relative min-h-[20vh]': !fullScreen,
      'bg-background/80 backdrop-blur-sm': overlay
    },
    className
  )

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} />
      </div>
      {fullScreen && children}
    </div>
  )
}

export default Loader
