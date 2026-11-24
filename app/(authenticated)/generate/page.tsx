import { getSessionUser, getBrandsLite } from "@/app/actions/user-auth"
import { redirect } from "next/navigation"
import { GenerateClient } from "@/components/generate/generate-client"

export const maxDuration = 300;

export default async function GeneratePage({
    searchParams,
}: {
    searchParams: Promise<{ session?: string }>
}) {
    const user = await getSessionUser()
    if (!user) {
        redirect("/login")
    }

    const brands = await getBrandsLite()
    const { session } = await searchParams

    return (
        <GenerateClient user={user} brands={brands} initialSessionId={session ?? null} />
    )
}
