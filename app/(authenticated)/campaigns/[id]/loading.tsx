export default function CampaignDetailLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-muted rounded-md" />
        <div className="h-40 bg-muted rounded-xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="aspect-square bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  )
}