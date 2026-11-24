"use client"

import React, { useEffect, useState } from "react"
import { useUI } from "@/components/context/ui-context"
import {
    X,
    LogOut,
    CreditCard,
    ChevronRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { logoutUser } from "@/app/actions/user-auth"
import { UserSidebarNav } from "./user-sidebar-nav"

interface UserSidebarProps {
    user: {
        id: string
        username: string
        credits: number
    } | null
    brandsCount: number
}

export function UserSidebar({ user, brandsCount }: UserSidebarProps) {
    const { isSidebarOpen, closeSidebar } = useUI()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !user) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/65 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 right-0 h-full w-[85vw] sm:w-1/2 max-w-sm bg-card border-l border-border z-[101] shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Account</h2>
                    <button
                        onClick={closeSidebar}
                        className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/70 border border-border rounded-xl">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.username}&background=18181f&color=fff&bold=true`}
                            alt="User"
                            className="h-10 w-10 rounded-lg object-cover border border-border"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-foreground truncate">{user.username}</h3>
                            <p className="text-xs text-muted-foreground">Pro Member</p>
                        </div>
                    </div>

                    {/* Credits Card */}
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-foreground" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Credits</span>
                            </div>
                            <span className="text-2xl font-black text-foreground">{user.credits}</span>
                        </div>
                        <Link
                            href="/recharge"
                            onClick={closeSidebar}
                            className="mt-3 inline-flex w-full items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                            Recharge
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <UserSidebarNav brandsCount={brandsCount} closeSidebar={closeSidebar} />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => {
                            closeSidebar()
                            logoutUser()
                        }}
                        className="w-full h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>
        </>
    )
}
