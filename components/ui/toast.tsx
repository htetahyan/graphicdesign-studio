"use client"

import { useUI } from "@/components/context/ui-context"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const colorMap = {
    success: "bg-card border-emerald-500/30 text-emerald-300",
    error: "bg-card border-red-500/30 text-red-300",
    warning: "bg-card border-amber-500/30 text-amber-300",
    info: "bg-card border-blue-500/30 text-blue-300",
}

const iconColorMap = {
    success: "text-emerald-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
}

export function ToastContainer() {
    const { toasts, removeToast } = useUI()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 sm:top-auto sm:bottom-6 sm:right-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
            {toasts.map((toast) => {
                const Icon = iconMap[toast.type]
                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl animate-in slide-in-from-top-4 sm:slide-in-from-bottom-4 fade-in duration-300 backdrop-blur-md",
                            colorMap[toast.type]
                        )}
                    >
                        <Icon className={cn("w-5 h-5 shrink-0", iconColorMap[toast.type])} />
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
