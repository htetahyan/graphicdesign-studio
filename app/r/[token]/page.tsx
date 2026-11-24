import { getReviewCampaign } from "@/app/actions/campaign";
import { ReviewClient } from "@/components/campaign/review-client";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  try {
    const campaign = await getReviewCampaign(token);
    return <ReviewClient token={token} campaign={campaign} />;
  } catch {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-serif">Link expired</h1>
          <p className="text-sm text-muted-foreground">
            This review link is invalid or no longer available.
          </p>
        </div>
      </main>
    );
  }
}
