import { Skeleton } from "@/components/ui/skeleton"

export function RechargeSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="border-b border-border bg-card px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <Skeleton className="h-8 w-32" />
             <Skeleton className="h-10 w-10 rounded-md" />
          </div>
       </header>
       <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="rounded-md border border-border bg-card p-5 shadow-sm space-y-4">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="rounded-md border border-border bg-card p-5 space-y-3">
                   <Skeleton className="h-3 w-16" />
                   <Skeleton className="h-8 w-24" />
                   <Skeleton className="h-10 w-full" />
                </div>
             ))}
          </div>
       </main>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="border-b border-border bg-card px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <Skeleton className="h-8 w-32" />
             <Skeleton className="h-10 w-10 rounded-md" />
          </div>
       </header>
       <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="flex items-center gap-6">
             <Skeleton className="h-20 w-20 rounded-full" />
             <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
             </div>
          </div>
          <div className="space-y-4 pt-6">
             <Skeleton className="h-12 w-full rounded-md" />
             <Skeleton className="h-12 w-full rounded-md" />
             <Skeleton className="h-12 w-full rounded-md" />
          </div>
       </main>
    </div>
  )
}

export function BrandFormSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <Skeleton className="h-8 w-32" />
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-4">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <Skeleton className="h-11 w-full rounded-sm" />
        <Skeleton className="h-3 w-36 rounded-sm" />
        <Skeleton className="h-20 w-full rounded-sm" />
        <Skeleton className="h-11 w-full rounded-sm" />
      </main>
    </div>
  );
}

export function BrandOnboardingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card h-14 flex items-center px-4">
        <Skeleton className="h-8 w-8 rounded-sm" />
        <Skeleton className="mx-auto h-4 w-44 rounded-sm" />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        <div className="rounded-md border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-11 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-11 w-full" />
        </div>
      </main>
    </div>
  );
}

export function AdminLoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-sm rounded-md border border-gray-800 bg-gray-900 p-6 space-y-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-3 w-20 mx-auto bg-gray-800" />
          <Skeleton className="h-6 w-40 mx-auto bg-gray-800" />
        </div>
        <Skeleton className="h-10 w-full bg-gray-800" />
        <Skeleton className="h-10 w-full bg-red-900/40" />
      </div>
    </div>
  );
}

export function AdminPaymentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 space-y-4">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-md border border-gray-800 bg-gray-900 p-4 space-y-2">
          <Skeleton className="h-5 w-40 bg-gray-800" />
          <Skeleton className="h-3 w-52 bg-gray-800" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-md border border-gray-800 bg-gray-900 p-4 space-y-3">
             <div className="flex justify-between">
               <Skeleton className="h-4 w-36 bg-gray-800" />
               <Skeleton className="h-4 w-20 bg-gray-800" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <Skeleton className="h-44 w-full bg-gray-800 md:col-span-2" />
               <div className="space-y-2">
                 <Skeleton className="h-9 w-full bg-gray-800" />
                 <Skeleton className="h-9 w-full bg-gray-800" />
                 <Skeleton className="h-9 w-full bg-green-900/35" />
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
