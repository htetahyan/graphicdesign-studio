"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { GenerateResult } from "@/app/(authenticated)/generate/types"

export interface Job {
  id: string
  status: string
  prompt: string
  created_at?: string
}

export interface JobContextType {
  activeJobs: Job[]
  progressValue: number
  addJob: (jobId: string, prompt: string) => void
  completedResult: GenerateResult | null
  setCompletedResult: (res: GenerateResult | null) => void
}

export const JobContext = createContext<JobContextType>({
  activeJobs: [],
  progressValue: 0,
  addJob: () => {},
  completedResult: null,
  setCompletedResult: () => {},
})

export function useJobProgress(activeJobsLength: number) {
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    if (activeJobsLength === 0) {
      setProgressValue(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const capped = 90;
      // Reaches 90% in 30 seconds
      const next = Math.min(capped, 10 + (elapsed / 30000) * 80);
      setProgressValue((prev) => (next > prev ? next : prev));
    }, 200);

    return () => clearInterval(timer);
  }, [activeJobsLength]);

  return { progressValue, setProgressValue };
}
