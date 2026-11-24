"use client"

import { Loader2 } from "lucide-react"

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
                        <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-semibold text-foreground">Loading...</p>
                    <p className="text-xs text-muted-foreground">Please wait</p>
                </div>
            </div>
        </div>
    )
}

export function InlineLoader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex items-center justify-center gap-2 p-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{text}</span>
        </div>
    )
}
