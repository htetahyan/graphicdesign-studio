"use client"

import { useActionState, useMemo, useState } from "react"
import Link from "next/link"
import { createRechargeRequest } from "@/app/actions/recharge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CreditCard, Upload, Clock, ArrowLeft } from "lucide-react"
import { PaymentInfoBanner } from "./components/PaymentInfoBanner"
import { RecentRequestsList } from "./components/RecentRequestsList"
import { RechargePackage, RechargeRequest } from "./types"

export type { RechargePackage, RechargeRequest };

export function RechargeClient({
    user,
    packages,
    requests,
}: {
    user: { id: string; username: string; credits: number }
    packages: RechargePackage[]
    requests: RechargeRequest[]
}) {
    const [state, action, isPending] = useActionState(createRechargeRequest, null)
    const [selectedPackageId, setSelectedPackageId] = useState<string>(packages?.[0]?.id || "")
    const [fileName, setFileName] = useState<string>("")

    const hasPending = useMemo(() => requests?.some(r => r.status === "pending"), [requests])

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
                {/* Header Compact */}
                <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-4">
                        <Link href="/gallery" className="p-2 rounded-full hover:bg-secondary transition-colors">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-foreground leading-tight">Recharge Credits</h1>
                            <p className="text-xs text-muted-foreground font-medium">Select a package to refill your credits account.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-xs font-black text-foreground">{user.credits} Credits</span>
                    </div>
                </div>

                {/* High-priority KBZPay Payment Info Banner */}
                <PaymentInfoBanner />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* LEFT COLUMN: Main Action Area */}
                    <div className="md:col-span-12 lg:col-span-7 space-y-4">
                        <Card className="rounded-2xl p-4 lg:p-5 bg-card border border-border shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <h2 className="text-sm shadow-sm font-black text-foreground bg-secondary px-3 py-1 rounded-md border border-border">1. Select Package</h2>
                                {hasPending && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold animate-pulse">
                                        <Clock className="h-3 w-3" /> Pending Request
                                    </div>
                                )}
                            </div>

                            <form action={action} className="space-y-5">
                                <input type="hidden" name="packageId" value={selectedPackageId} />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                    {packages.map((p) => {
                                        const selected = p.id === selectedPackageId
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedPackageId(p.id)}
                                                disabled={isPending}
                                                className={cn(
                                                    "relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200 active:scale-[0.98]",
                                                    selected
                                                        ? "bg-secondary border-primary ring-1 ring-primary text-foreground shadow-md"
                                                        : "bg-card border-border text-foreground hover:border-white/20"
                                                )}
                                            >
                                                <div className={cn(
                                                    "text-[10px] font-black uppercase tracking-wider mb-0.5 px-2 py-0.5 rounded-sm",
                                                    selected ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                                                )}>
                                                    {p.title}
                                                </div>
                                                <div className="flex items-baseline gap-1 my-1">
                                                    <span className="text-2xl font-black leading-none text-foreground">{p.credits}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">Designs</span>
                                                </div>
                                                <div className={cn(
                                                    "mt-1 w-full pt-1.5 border-t border-border",
                                                    selected ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    <span className="text-[11px] font-black">AED {p.priceKs.toLocaleString()}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="pt-2">
                                    <h2 className="text-sm shadow-sm font-black text-foreground bg-secondary border border-border px-3 py-1 rounded-md mb-3 inline-block">2. Upload payment receipt</h2>

                                    <label className={cn(
                                        "relative flex flex-row items-center justify-between w-full p-4 border border-dashed rounded-xl transition-all duration-200 group cursor-pointer",
                                        isPending ? "opacity-50 cursor-not-allowed bg-secondary/40 border-border" : "bg-secondary/50 border-border hover:bg-secondary hover:border-white/30",
                                        fileName && "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-2.5 rounded-lg transition-colors border",
                                                fileName ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-card shadow-sm text-muted-foreground group-hover:text-foreground border-border"
                                            )}>
                                                {fileName ? <Clock className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col text-left text-sm">
                                                <span className="font-bold text-foreground">{fileName || "Click to browse screenshot"}</span>
                                                <span className="text-xs text-muted-foreground font-medium">{fileName ? "Screenshot selected" : "PNG, JPG max 5MB"}</span>
                                            </div>
                                        </div>

                                        {!fileName && (
                                            <div className="px-3 py-1.5 bg-card border border-border rounded-md shadow-sm text-xs font-bold text-foreground group-hover:bg-accent">Browse</div>
                                        )}

                                        <input
                                            type="file"
                                            name="screenshot"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isPending}
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                setFileName(f?.name || "")
                                            }}
                                        />
                                    </label>
                                </div>

                                {state?.error && (
                                    <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg">{state.error}</div>
                                )}
                                {state?.success && (
                                    <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg">✓ Request submitted successfully.</div>
                                )}

                                <Button
                                    disabled={isPending}
                                    variant="default"
                                    className="w-full h-12 text-sm font-extrabold rounded-xl shadow-md bg-primary hover:opacity-90 text-primary-foreground"
                                >
                                    {isPending ? (
                                        <span className="inline-flex items-center gap-2 animate-pulse">
                                            <Clock className="h-4 w-4" /> Processing...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            <Upload className="h-4 w-4" /> Submit Recharge Request
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    <div className="md:col-span-12 lg:col-span-5 space-y-4">
                        <RecentRequestsList requests={requests} />
                    </div>
                </div>
            </div>
        </div>
    )
}

