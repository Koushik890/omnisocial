import {
    Sheet as ShadcnSheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
  } from '@/components/ui/sheet'
  
  import React from 'react'
  import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
  
  type Props = {
    trigger: React.ReactNode
    children: React.ReactNode
    className?: string
    side: 'left' | 'right'
    title?: string
  }
  
  const Sheet = ({ children, trigger, className, side, title = 'Navigation Menu' }: Props) => {
    return (
      <ShadcnSheet>
        <SheetTrigger className={className}>{trigger}</SheetTrigger>
        <SheetContent
          side={side}
          className="p-0"
        >
          <VisuallyHidden>
            <SheetTitle>{title}</SheetTitle>
          </VisuallyHidden>
          {children}
        </SheetContent>
      </ShadcnSheet>
    )
  }
  
  export default Sheet