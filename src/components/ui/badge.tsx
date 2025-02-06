import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80",
        destructive:
          "border-transparent bg-red-500/10 text-red-600 hover:bg-red-500/20",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-green-50 text-green-700 hover:bg-green-100",
        warning: "border-transparent bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
