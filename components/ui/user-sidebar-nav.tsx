"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Briefcase,
    Wand2,
    PlusCircle,
    CreditCard,
    HelpCircle,
    ChevronRight
} from "lucide-react"

interface UserSidebarNavProps {
    brandsCount: number
    closeSidebar: () => void
}

export function UserSidebarNav({ brandsCount, closeSidebar }: UserSidebarNavProps) {
    const pathname = usePathname()

    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-2">Menu</label>

            <Link
                href="/gallery"
                onClick={closeSidebar}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    pathname === "/gallery" ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        pathname === "/gallery" ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <span className={cn(
                        "text-sm font-medium",
                        pathname === "/gallery" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Gallery
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-md border border-border">{brandsCount}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
            </Link>

            <Link
                href="/campaigns"
                onClick={closeSidebar}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    pathname?.startsWith("/campaigns") ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        pathname?.startsWith("/campaigns") ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <span className={cn(
                        "text-sm font-medium",
                        pathname?.startsWith("/campaigns") ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Campaigns
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </Link>

            <Link
                href="/generate"
                onClick={closeSidebar}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    pathname === "/generate" ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        pathname === "/generate" ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                        <Wand2 className="w-4 h-4" />
                    </div>
                    <span className={cn(
                        "text-sm font-medium",
                        pathname === "/generate" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Generate
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </Link>

            {brandsCount >= 5 ? (
                <div className="flex items-center justify-between p-3 rounded-xl opacity-50 cursor-not-allowed" title="Limit reached: 5 brands max">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-secondary text-muted-foreground">
                            <PlusCircle className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            New Brand (Max 5)
                        </span>
                    </div>
                </div>
            ) : (
                <Link
                    href="/brand/new"
                    onClick={closeSidebar}
                    className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-colors",
                        pathname === "/brand/new" ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            pathname === "/brand/new" ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                        )}>
                            <PlusCircle className="w-4 h-4" />
                        </div>
                        <span className={cn(
                            "text-sm font-medium",
                            pathname === "/brand/new" ? "text-foreground" : "text-muted-foreground"
                        )}>
                            New Brand
                        </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Link>
            )}

            <Link
                href="/recharge"
                onClick={closeSidebar}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    pathname === "/recharge" ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        pathname === "/recharge" ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <span className={cn(
                        "text-sm font-medium",
                        pathname === "/recharge" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Recharge
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </Link>

            <Link
                href="/help"
                onClick={closeSidebar}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    pathname === "/help" ? "bg-accent text-foreground" : "hover:bg-secondary/70"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        pathname === "/help" ? "bg-primary/15 text-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className={cn(
                        "text-sm font-medium",
                        pathname === "/help" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Help
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </Link>
        </div>
    )
}
