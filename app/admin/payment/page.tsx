import { redirect } from "next/navigation"
import { checkAdminSession } from "@/lib/auth"
import { getPaymentScreenshotPublicUrl, getRechargeRequestsAdminPage } from "@/app/actions/admin-payments"
import { AdminRequestCard } from "./components/request-card"

export default async function AdminPaymentPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const sp = (await searchParams) || {}
    const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
    const statusParam = Array.isArray(sp.status) ? sp.status[0] : sp.status
    const errorParam = Array.isArray(sp.error) ? sp.error[0] : sp.error
    const successParam = Array.isArray(sp.success) ? sp.success[0] : sp.success

    const page = Math.max(1, Number(pageParam || 1) || 1)
    const status = (statusParam || "all") as "pending" | "approved" | "rejected" | "all"

    const limit = 12
    const offset = (page - 1) * limit

    const { rows: requests, total } = await getRechargeRequestsAdminPage({ limit, offset, status })
    const totalPages = Math.max(1, Math.ceil((total || 0) / limit))
    const hasPrev = page > 1
    const hasNext = page < totalPages

    const screenshotUrlsById = new Map<string, string | null>()
    for (const r of requests as any[]) {
        const path = r?.payment_screenshot_path
        if (path && path !== "pending") {
            const url = await getPaymentScreenshotPublicUrl(path)
            screenshotUrlsById.set(r.id, url)
        } else {
            screenshotUrlsById.set(r.id, null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">
            <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                        PAYMENT_QUEUE
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Recharge requests: {total} • Page {page}/{totalPages}</p>
                </div>
                <div className="flex items-center gap-2">
                    <a href="/admin" className="text-xs font-bold text-gray-400 hover:text-gray-200 underline underline-offset-4">
                        BACK_TO_DASHBOARD
                    </a>
                </div>
            </header>

            {errorParam && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded-lg text-red-200 text-sm font-bold">
                    ERROR: {errorParam}
                </div>
            )}
            {successParam && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-900/50 rounded-lg text-green-200 text-sm font-bold">
                    SUCCESS: Request {successParam}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <a
                        href={`/admin/payment?status=all&page=1`}
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${status === "all" ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"}`}
                    >
                        ALL
                    </a>
                    <a
                        href={`/admin/payment?status=pending&page=1`}
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${status === "pending" ? "bg-amber-900/30 border-amber-900/50 text-amber-200" : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"}`}
                    >
                        PENDING
                    </a>
                    <a
                        href={`/admin/payment?status=approved&page=1`}
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${status === "approved" ? "bg-green-900/30 border-green-900/50 text-green-200" : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"}`}
                    >
                        APPROVED
                    </a>
                    <a
                        href={`/admin/payment?status=rejected&page=1`}
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${status === "rejected" ? "bg-red-900/30 border-red-900/50 text-red-200" : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"}`}
                    >
                        REJECTED
                    </a>
                </div>

                <div className="flex items-center gap-1.5">
                    <a
                        href={`/admin/payment?status=${status}&page=${Math.max(1, page - 1)}`}
                        className={`text-xs font-bold px-3 py-1.5 rounded border border-gray-800 transition-colors ${hasPrev ? "text-gray-300 hover:text-white hover:bg-gray-900" : "text-gray-600 pointer-events-none"}`}
                    >
                        ← PREV
                    </a>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let p: number
                        if (totalPages <= 5) {
                            p = i + 1
                        } else if (page <= 3) {
                            p = i + 1
                        } else if (page >= totalPages - 2) {
                            p = totalPages - 4 + i
                        } else {
                            p = page - 2 + i
                        }
                        return (
                            <a
                                key={p}
                                href={`/admin/payment?status=${status}&page=${p}`}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded border transition-colors ${p === page
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : "border-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-900"
                                    }`}
                            >
                                {p}
                            </a>
                        )
                    })}
                    <a
                        href={`/admin/payment?status=${status}&page=${Math.min(totalPages, page + 1)}`}
                        className={`text-xs font-bold px-3 py-1.5 rounded border border-gray-800 transition-colors ${hasNext ? "text-gray-300 hover:text-white hover:bg-gray-900" : "text-gray-600 pointer-events-none"}`}
                    >
                        NEXT →
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {requests.map((r: any) => (
                    <AdminRequestCard
                        key={r.id}
                        request={r}
                        screenshotUrl={screenshotUrlsById.get(r.id) ?? null}
                    />
                ))}

                {requests.length === 0 && (
                    <div className="text-center text-gray-500 font-bold">EMPTY_QUEUE</div>
                )}
            </div>
        </div>
    )
}
