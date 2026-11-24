import { getSessionUser, getBrandsLite } from "@/app/actions/user-auth";
import { redirect } from "next/navigation";
import BrandOnboardingClient from "./onboarding-client";
import { fetchInspirationTemplates } from "@/app/actions/inspirations";

export default async function BrandOnboardingPage() {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    const brands = await getBrandsLite();

    if (user.credits <= 0) {
        redirect("/recharge");
    }

    const initialTemplates = await fetchInspirationTemplates({
        limit: 6,
        offset: 0,
    });

    return (
      <BrandOnboardingClient
        initialTemplates={initialTemplates}
        brandsCount={brands.length}
      />
    );
}
