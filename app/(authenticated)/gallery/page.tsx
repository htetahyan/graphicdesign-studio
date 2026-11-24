import { getSessionUser, getHistoryLite, getBrandsLite } from "@/app/actions/user-auth"
import { redirect } from "next/navigation"
import { GalleryClient } from "@/components/gallery/gallery-client"
import { GallerySkeleton } from "@/components/ui/skeletons"
import { Suspense } from "react"

export default async function GalleryPage() {
    const user = await getSessionUser()
    if (!user) {
        redirect("/login")
    }

    const historyPromise = getHistoryLite(50)
    const brandsPromise = getBrandsLite()

    return (
        <Suspense fallback={<GallerySkeleton />}>
            <GalleryClient user={user} historyPromise={historyPromise} brandsPromise={brandsPromise} />
        </Suspense>
    )
}
