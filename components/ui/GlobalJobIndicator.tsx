"use client"
import React from "react"
import { useJobs } from "@/components/context/job-context"
import { Loader2 } from "lucide-react"

export function GlobalJobIndicator() {
  const { activeJobs } = useJobs()
  
  if (activeJobs.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[200] animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full shadow-sm backdrop-blur-md">
         <Loader2 className="w-3.5 h-3.5 animate-spin" />
         <span className="text-xs font-bold">{activeJobs.length} Background {activeJobs.length === 1 ? 'Job' : 'Jobs'}</span>
      </div>
    </div>
  )
}
