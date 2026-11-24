"use client"

import { Suspense } from "react"
import { useBackButton } from "@/hooks/useBackButton"

/**
 * Isolated so usePathname() can suspend without blocking the rest of the tree.
 * Next.js Cache Components requires this for routes with dynamic params.
 */
function CapacitorBackButton() {
  useBackButton()
  return null
}

export function BackButtonProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <CapacitorBackButton />
      </Suspense>
      {children}
    </>
  )
}