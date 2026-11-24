"use client"

import { Loader2 } from "lucide-react"

interface ProgressBarProps {
  progress?: number // 0-100; if undefined, show indeterminate spinner
  size?: "sm" | "md" | "lg"
  className?: string
  showPercentage?: boolean
  label?: string
}

export function ProgressBar({ 
  progress, 
  size = "md", 
  className = "", 
  showPercentage = false,
  label 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }

  const isIndeterminate = progress === undefined

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">{label}</span>
          {showPercentage && !isIndeterminate && (
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      {isIndeterminate ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className={`w-full bg-secondary rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}
