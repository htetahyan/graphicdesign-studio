import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DeleteUserButton } from "../delete-user-button"
import { setUserCredits, changeUserPassword, deleteUser, impersonateUser, toggleBlockUser } from "@/app/actions/admin"

interface UserTableProps {
    users: any[]; total: number; page: number; totalPages: number; search: string;
    limit: number; offset: number; hasPrev: boolean; hasNext: boolean;
}

export function UserTable({
    users, total, page, totalPages, search, limit, offset, hasPrev, hasNext,
}: UserTableProps) {
    return (
        <div className="xl:col-span-3 space-y-4">
            <form className="flex items-center gap-2">
                <Input name="q" defaultValue={search} placeholder="Search users..." className="bg-gray-900 border-gray-800 text-white max-w-xs h-9 text-sm" />
                <Button type="submit" size="sm" variant="outline" className="h-9 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">SEARCH</Button>
                {search && <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2">clear</Link>}
            </form>
            <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-800 text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">USERNAME</th>
                                    <th className="px-4 py-3 font-medium">CREDITS</th>
                                    <th className="px-4 py-3 font-medium hidden md:table-cell">CREATED</th>
                                    <th className="px-4 py-3 font-medium text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {users.map((user: any) => (
                                    <tr key={user.id} className="group hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-200 font-bold">{user.username}</span>
                                                    {user.isBlocked && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-950/40 text-red-400 font-bold border border-red-900/50">
                                                            BLOCKED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-[10px] font-mono mt-0.5">{user.id.slice(0, 8)}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-900/30 text-blue-400 text-xs font-bold border border-blue-900/50">{user.credits} CR</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                <form action={async (fd) => {
                                                    "use server"; const c = Number(fd.get("credits") || 0);
                                                    if (c >= 0) { await setUserCredits(user.id, c); redirect("/admin"); }
                                                }} className="flex items-center gap-1">
                                                    <Input name="credits" type="number" defaultValue={user.credits} min={0} className="w-20 h-7 text-xs bg-gray-950 border-gray-700 text-white px-2" />
                                                    <Button size="sm" type="submit" variant="outline" className="h-7 text-[10px] bg-transparent border-gray-700 hover:bg-blue-900/30 text-blue-400 px-2">SET</Button>
                                                </form>
                                                <form action={async (fd) => {
                                                    "use server"; const pw = fd.get("pw") as string;
                                                    if (pw && pw.length >= 4) { await changeUserPassword(user.id, pw); redirect("/admin"); }
                                                }} className="flex items-center gap-1">
                                                    <Input name="pw" type="text" placeholder="new pw" className="w-20 h-7 text-xs bg-gray-950 border-gray-700 text-white px-2" />
                                                    <Button size="sm" type="submit" variant="outline" className="h-7 text-[10px] bg-transparent border-gray-700 hover:bg-amber-900/30 text-amber-400 px-2">PW</Button>
                                                </form>
                                                <form action={async () => {
                                                    "use server";
                                                    await toggleBlockUser(user.id);
                                                    redirect("/admin");
                                                }}>
                                                    <Button size="sm" type="submit" variant="outline" className={`h-7 text-[10px] bg-transparent border-gray-700 px-2 font-bold ${user.isBlocked ? "hover:bg-green-900/30 text-green-400" : "hover:bg-red-900/30 text-red-400"}`}>{user.isBlocked ? "UNBLOCK" : "BLOCK"}</Button>
                                                </form>
                                                <DeleteUserButton userId={user.id} username={user.username} deleteAction={async (id: string) => { "use server"; await deleteUser(id); redirect("/admin"); }} />
                                                <form action={async () => {
                                                    "use server";
                                                    await impersonateUser(user.id);
                                                }}>
                                                    <Button size="sm" type="submit" variant="outline" className="h-7 text-[10px] bg-transparent border-gray-700 hover:bg-green-900/30 text-green-400 px-2 font-bold">LOGIN</Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-bold">{search ? `No users matching "${search}"` : "No users found"}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3">
                            <p className="text-xs text-gray-500">Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}</p>
                            <div className="flex items-center gap-1.5">
                                <Link href={`/admin?page=${Math.max(1, page - 1)}${search ? `&q=${search}` : ''}`} className={`text-xs font-bold px-3 py-1.5 rounded border border-gray-800 transition-colors ${hasPrev ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 pointer-events-none"}`}>← PREV</Link>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                                    return (
                                        <Link key={p} href={`/admin?page=${p}${search ? `&q=${search}` : ''}`} className={`text-xs font-bold px-2.5 py-1.5 rounded border transition-colors ${p === page ? "bg-gray-800 border-gray-700 text-white" : "border-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-900"}`}>{p}</Link>
                                    )
                                })}
                                <Link href={`/admin?page=${Math.min(totalPages, page + 1)}${search ? `&q=${search}` : ''}`} className={`text-xs font-bold px-3 py-1.5 rounded border border-gray-800 transition-colors ${hasNext ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 pointer-events-none"}`}>NEXT →</Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
