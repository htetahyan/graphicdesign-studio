import { getSessionUser } from "@/app/actions/user-auth";
import { listCampaigns } from "@/app/actions/campaign";
import { redirect } from "next/navigation";
import { CampaignList } from "@/components/campaign/campaign-list";

export default async function CampaignsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const campaigns = await listCampaigns();
  return <CampaignList campaigns={campaigns} />;
}
