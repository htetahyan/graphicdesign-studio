import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createUser, updateUserCredits } from "@/app/actions/admin"

interface AdminSidebarProps {
    total: number
    users: any[]
}

export function AdminSidebar({ total, users }: AdminSidebarProps) {
    return (
        <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 text-sm">CREATE_USER</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server"
                        await createUser(formData)
                        redirect("/admin")
                    }} className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Username</label>
                            <Input name="username" className="bg-gray-950 border-gray-800 text-white h-9" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Password</label>
                            <Input name="password" type="text" className="bg-gray-950 border-gray-800 text-white h-9" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Initial Credits</label>
                            <Input name="credits" type="number" defaultValue={10} min={0} className="bg-gray-950 border-gray-800 text-white h-9" />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 text-sm">
                            Create User
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Quick Add Credits */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 text-sm">QUICK_ADD_CREDITS</CardTitle>
                    <CardDescription className="text-xs">Add credits to any user by username</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server"
                        const username = formData.get("username") as string
                        const amount = Number(formData.get("amount") || 0)
                        if (!username || amount <= 0) return

                        const { getUsersPaginated } = await import("@/app/actions/admin")
                        const { users } = await getUsersPaginated({ limit: 1, search: username })
                        if (users.length > 0 && users[0].username === username) {
                            await updateUserCredits(users[0].id, amount)
                        }
                        redirect("/admin")
                    }} className="space-y-3">
                        <Input name="username" placeholder="Username" className="bg-gray-950 border-gray-800 text-white h-9" required />
                        <Input name="amount" type="number" placeholder="Amount to add" min={1} className="bg-gray-950 border-gray-800 text-white h-9" required />
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-9 text-sm">
                            + Add Credits
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-gray-100 text-sm">STATS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total Users</span>
                        <span className="text-gray-200 font-bold">{total}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total Credits</span>
                        <span className="text-blue-400 font-bold">
                            {users.reduce((sum: number, u: any) => sum + (u.credits || 0), 0)} CR
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
