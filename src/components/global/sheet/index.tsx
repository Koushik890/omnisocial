'use client'

import * as React from 'react'
import {
  Sheet as ShadcnSheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type DialogProps = React.ComponentProps<typeof ShadcnSheet>

const Sheet = ({ children, ...props }: DialogProps) => (
  <ShadcnSheet {...props}>
    {children}
  </ShadcnSheet>
)
Sheet.displayName = 'Sheet'

const SheetTriggerComponent = React.forwardRef<
  React.ElementRef<typeof SheetTrigger>,
  React.ComponentPropsWithoutRef<typeof SheetTrigger>
>(({ children, ...props }, ref) => (
  <SheetTrigger {...props} ref={ref}>
    {children}
  </SheetTrigger>
))
SheetTriggerComponent.displayName = 'SheetTrigger'

const SheetContentComponent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  React.ComponentPropsWithoutRef<typeof SheetContent>
>(({ children, ...props }, ref) => (
  <SheetContent {...props} ref={ref}>
    {children}
  </SheetContent>
))
SheetContentComponent.displayName = 'SheetContent'

const SheetHeaderComponent = ({ 
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <SheetHeader {...props}>
    {children}
  </SheetHeader>
)
SheetHeaderComponent.displayName = 'SheetHeader'

const SheetFooterComponent = ({ 
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <SheetFooter {...props}>
    {children}
  </SheetFooter>
)
SheetFooterComponent.displayName = 'SheetFooter'

const SheetTitleComponent = React.forwardRef<
  React.ElementRef<typeof SheetTitle>,
  React.ComponentPropsWithoutRef<typeof SheetTitle>
>(({ children, ...props }, ref) => (
  <SheetTitle {...props} ref={ref}>
    {children}
  </SheetTitle>
))
SheetTitleComponent.displayName = 'SheetTitle'

const SheetDescriptionComponent = React.forwardRef<
  React.ElementRef<typeof SheetDescription>,
  React.ComponentPropsWithoutRef<typeof SheetDescription>
>(({ children, ...props }, ref) => (
  <SheetDescription {...props} ref={ref}>
    {children}
  </SheetDescription>
))
SheetDescriptionComponent.displayName = 'SheetDescription'

const SheetCloseComponent = React.forwardRef<
  React.ElementRef<typeof SheetClose>,
  React.ComponentPropsWithoutRef<typeof SheetClose>
>(({ children, ...props }, ref) => (
  <SheetClose {...props} ref={ref}>
    {children}
  </SheetClose>
))
SheetCloseComponent.displayName = 'SheetClose'

export {
  Sheet,
  SheetTriggerComponent as SheetTrigger,
  SheetContentComponent as SheetContent,
  SheetHeaderComponent as SheetHeader,
  SheetFooterComponent as SheetFooter,
  SheetTitleComponent as SheetTitle,
  SheetDescriptionComponent as SheetDescription,
  SheetCloseComponent as SheetClose,
}