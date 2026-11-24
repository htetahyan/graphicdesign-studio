import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"

export function GallerySkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="relative px-6 py-4 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24 hidden sm:inline-block" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4 space-y-6">
        {/* Credits Hero Skeleton */}
        <div className="rounded-md px-6 py-5 border bg-card shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <Skeleton className="h-14 w-14 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full sm:w-40 rounded-sm" />
            <Skeleton className="h-12 w-full sm:w-48 rounded-sm" />
          </div>
        </div>

        {/* Brand Workspace Skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-full shrink-0" />
            ))}
          </div>
        </section>

        {/* Grid Skeleton */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full md:w-80" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square p-1 border border-border rounded-md bg-card">
                <Skeleton className="w-full h-full rounded-sm" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export function GenerateSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header Skeleton */}
      <div className="relative w-full px-4 mt-4 mb-2">
        <header className="bg-card px-4 py-2 border border-border rounded-md flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </header>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] lg:h-full flex flex-col bg-background lg:border-r border-t lg:border-t-0 border-border order-2 lg:order-1 shrink-0">
          <div className="flex-1 px-6 pt-4 pb-2 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 rounded-sm" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          </div>
          <div className="p-6 border-t border-border space-y-4">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </aside>

        {/* Preview Skeleton */}
        <main className="flex-1 bg-accent/10 relative flex flex-col items-center justify-center p-6 lg:p-12 order-1 lg:order-2 overflow-y-auto">
          <div className="max-w-md w-full space-y-8 flex flex-col items-center text-center">
            <Skeleton className="h-40 w-40 rounded-md" />
            <div className="space-y-3 flex flex-col items-center w-full">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-sm" />
              <Skeleton className="h-6 w-24 rounded-sm" />
              <Skeleton className="h-6 w-24 rounded-sm" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export function GlobalSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-sm bg-accent p-3">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-11 w-full rounded-sm" />
          <Skeleton className="h-11 w-full rounded-sm" />
          <Skeleton className="h-11 w-2/3 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export function AuthSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-md border border-border bg-card p-7 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex rounded-sm bg-accent p-3">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl tracking-tight">Welcome</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue</p>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-11 w-full rounded-sm" />
          <Skeleton className="h-11 w-full rounded-sm" />
          <Skeleton className="h-11 w-full rounded-sm" />
        </div>
      </div>
    </div>
  )
}

// Re-export other skeletons for backward compatibility
export * from "./brand-skeletons"
