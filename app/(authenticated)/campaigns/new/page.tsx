import { getSessionUser, getBrandsLite } from "@/app/actions/user-auth";
import { redirect } from "next/navigation";
import { CampaignForm } from "@/components/campaign/campaign-form";

export default async function NewCampaignPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const brands = await getBrandsLite();
  return <CampaignForm userCredits={user.credits} brands={brands} />;
}
