import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-sm" shimmer={false} />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-sm" shimmer={false} />
              <Skeleton className="h-2 w-40 rounded-sm" shimmer={false} />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded-sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <section className="rounded-md border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-sm" />
              <Skeleton className="h-8 w-48 rounded-sm" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-sm" />
              <Skeleton className="h-10 w-32 rounded-sm" shimmer={false} />
            </div>
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-5 shadow-sm">
          <Skeleton className="mb-4 h-4 w-44 rounded-sm" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm border border-border p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-sm" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 rounded-sm" />
                    <Skeleton className="h-3 w-16 rounded-sm" shimmer={false} />
                  </div>
                </div>
                <Skeleton className="h-9 w-full rounded-sm" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-5 shadow-sm">
          <Skeleton className="mb-4 h-4 w-36 rounded-sm" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
