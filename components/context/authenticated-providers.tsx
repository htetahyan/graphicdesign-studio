"use client"

import React from "react"
import { JobProvider } from "@/components/context/job-context"
import { GlobalJobIndicator } from "@/components/ui/GlobalJobIndicator"
import { GlobalLightbox } from "@/components/ui/GlobalLightbox"

export function AuthenticatedProviders({ children, userId }: { children: React.ReactNode, userId: string }) {
  return (
    <JobProvider userId={userId}>
      {children}
      <GlobalJobIndicator />
      <GlobalLightbox />
    </JobProvider>
  )
}
