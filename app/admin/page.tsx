import { redirect } from "next/navigation"
import Link from "next/link"
import { logoutAdmin } from "@/app/actions/auth"
import { checkAdminSession } from "@/lib/auth"
import { getUsersPaginated } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

import { UserTable } from "./components/UserTable"
import { AdminSidebar } from "./components/AdminSidebar"

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const sp = (await searchParams) || {}
    const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
    const searchQuery = Array.isArray(sp.q) ? sp.q[0] : sp.q

    const page = Math.max(1, Number(pageParam || 1) || 1)
    const search = searchQuery || ""
    const limit = 15
    const offset = (page - 1) * limit

    const { users, total } = await getUsersPaginated({ limit, offset, search })
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const hasPrev = page > 1
    const hasNext = page < totalPages

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-6 font-mono">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                        ADMIN_CONSOLE
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Users: {total} • Page {page}/{totalPages}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/inspirations"
                        className="text-xs font-bold text-green-400 hover:text-green-300 underline underline-offset-4"
                    >
                        INSPIRATIONS→
                    </Link>
                    <Link
                        href="/admin/payment"
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4"
                    >
                        PAYMENT_QUEUE→
                    </Link>
                    <form action={logoutAdmin}>
                        <Button variant="destructive" size="sm">LOGOUT</Button>
                    </form>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <UserTable
                    users={users}
                    total={total}
                    page={page}
                    totalPages={totalPages}
                    search={search}
                    limit={limit}
                    offset={offset}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                />
                <AdminSidebar total={total} users={users} />
            </div>
        </div>
    )
}
