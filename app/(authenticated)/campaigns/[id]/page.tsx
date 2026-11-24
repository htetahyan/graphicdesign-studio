import { getSessionUser } from "@/app/actions/user-auth";
import { getCampaignDetail } from "@/app/actions/campaign";
import { redirect, notFound } from "next/navigation";
import { CampaignDetail } from "@/components/campaign/campaign-detail";

export const maxDuration = 300;

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { id } = await params;
  try {
    const campaign = await getCampaignDetail(id);
    return <CampaignDetail campaign={campaign} credits={user.credits} />;
  } catch {
    notFound();
  }
}
