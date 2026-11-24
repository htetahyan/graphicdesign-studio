import * as React from "react"
import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-sm bg-muted ring-1 ring-border/80",
        shimmer &&
          "animate-[skeleton-pulse_1.8s_cubic-bezier(0.4,0,0.6,1)_infinite] before:absolute before:inset-0 before:animate-[shimmer_2.2s_cubic-bezier(0.4,0,0.6,1)_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
