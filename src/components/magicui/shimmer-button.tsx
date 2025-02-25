import React, { CSSProperties, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.4)",
      shimmerSize = "2px",
      shimmerDuration = "2s",
      borderRadius = "9999px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--speed": shimmerDuration,
          } as CSSProperties
        }
        className={cn(
          "group relative overflow-hidden",
          "px-6 py-2",
          "rounded-full border border-white/20",
          "bg-gradient-to-r from-green-500 to-green-600",
          "animate-border-glow",
          "transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        <div className="relative z-10 text-white">
          {children}
        </div>
        <div className="animate-shimmer" />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
