"use client"

import { useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { App } from "@capacitor/app"
import { logger } from "@/lib/logger"

/**
 * Fallback route map: when browser history is empty or shallow,
 * navigate to the logical parent route instead of doing nothing.
 * More specific prefixes must come BEFORE shorter ones.
 */
const FALLBACK_ROUTES: { prefix: string; target: string }[] = [
  { prefix: "/campaigns/new", target: "/campaigns" },
  { prefix: "/campaigns", target: "/gallery" },
  { prefix: "/brand/edit", target: "/gallery" },
  { prefix: "/brand/new", target: "/generate" },
  { prefix: "/brand", target: "/generate" },
  { prefix: "/recharge", target: "/gallery" },
  { prefix: "/admin", target: "/generate" },
]

/** The default fallback when no prefix matches */
const DEFAULT_FALLBACK = "/generate"

function getFallbackRoute(pathname: string): string {
  for (const { prefix, target } of FALLBACK_ROUTES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return target
    }
  }
  return DEFAULT_FALLBACK
}

/**
 * Try to go back using browser history. If there is no meaningful history
 * (e.g. fresh Capacitor WebView session), navigate to the fallback route.
 */
function navigateBack(
  router: ReturnType<typeof useRouter>,
  pathname: string,
) {
  // history.length > 2 is a reasonable heuristic:
  //  – 1 = first page loaded (no history to go back to)
  //  – 2 = one navigation happened (may be the initial server redirect)
  if (typeof window !== "undefined" && window.history.length > 2) {
    router.back()
  } else {
    router.push(getFallbackRoute(pathname))
  }
}

export function useBackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const isNavigating = useRef(false)

  const handleBackButton = useCallback(() => {
    // Prevent multiple rapid back button presses
    if (isNavigating.current) return
    isNavigating.current = true
    setTimeout(() => { isNavigating.current = false }, 500)

    // ── 1. Dismiss overlays first ────────────────────────────────────────

    // Sidebar
    const sidebarOpen = document.querySelector('[class*="backdrop-blur-sm"][class*="bg-black/40"]')
    if (sidebarOpen) {
      ; (sidebarOpen as HTMLElement).click()
      return
    }

    // Modal (gallery preview, etc.)
    const modalOpen = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-[100]"]')
    if (modalOpen) {
      const backdrop = modalOpen.querySelector('[class*="bg-black"]')
      if (backdrop) {
        ; (backdrop as HTMLElement).click()
        return
      }
    }

    // Dialog (shadcn/radix)
    const dialogOverlay = document.querySelector('[data-state="open"][role="dialog"]')
    if (dialogOverlay) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }))
      return
    }

    // ── 2. Public / auth routes → minimize ───────────────────────────────

    const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/help", "/privacy", "/terms"]
    if (publicRoutes.includes(pathname)) {
      App.minimizeApp()
      return
    }

    // ── 3. Main tab routes ───────────────────────────────────────────────

    const mainRoutes = ["/generate", "/gallery", "/profile", "/recharge"]
    const isMainRoute = mainRoutes.some(route => pathname === route)

    if (isMainRoute) {
      if (pathname === "/generate") {
        App.minimizeApp()
      } else {
        router.push("/generate")
      }
      return
    }

    // ── 4. Sub-routes → go back with fallback ────────────────────────────

    navigateBack(router, pathname)
  }, [router, pathname])

  useEffect(() => {
    if (typeof window === "undefined") return

    let listener: { remove: () => void } | null = null

    const setupListener = async () => {
      try {
        listener = await App.addListener("backButton", handleBackButton)
      } catch (error) {
        // Not running on native platform, ignore
        logger.debug("Back button handler not available (web mode)")
      }
    }

    setupListener()

    return () => {
      listener?.remove()
    }
  }, [handleBackButton])
}

// Hook to handle back button with custom behavior (for modals, wizard steps, etc.)
export function useCustomBackButton(onBack: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return

    let listener: { remove: () => void } | null = null

    const setupListener = async () => {
      try {
        listener = await App.addListener("backButton", onBack)
      } catch (error) {
        logger.debug("Back button handler not available (web mode)")
      }
    }

    setupListener()

    return () => {
      listener?.remove()
    }
  }, [onBack])
}
