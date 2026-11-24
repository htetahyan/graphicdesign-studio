export default function ReviewLoading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-3 animate-pulse">
        <div className="h-8 w-40 mx-auto bg-muted rounded-md" />
        <div className="h-4 w-64 mx-auto bg-muted rounded-md" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    </main>
  )
}