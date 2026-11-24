import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { handleApproveRequest, handleRejectRequest } from "@/app/admin/payment/actions"

interface AdminRequestCardProps {
    request: any
    screenshotUrl: string | null
}

export function AdminRequestCard({ request: r, screenshotUrl }: AdminRequestCardProps) {
    return (
        <Card key={r.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <CardTitle className="text-gray-100 text-base">REQ_{r.id.slice(0, 8)}</CardTitle>
                        <CardDescription className="text-gray-400">
                            USER: {r.user?.username} • STATUS: {String(r.status).toUpperCase()} • {new Date(r.created_at).toLocaleString()}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs font-bold border border-blue-900/50">
                            {r.requested_credits} Credits
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-950 text-gray-300 text-xs font-bold border border-gray-800">
                            AED {r.requested_ks?.toLocaleString?.() || r.requested_ks}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="text-xs font-bold text-gray-500 mb-2">SCREENSHOT</div>
                        {screenshotUrl ? (
                            <img
                                src={screenshotUrl}
                                alt="payment screenshot"
                                className="w-full max-h-[420px] object-contain rounded-xl border border-gray-800 bg-gray-950"
                            />
                        ) : (
                            <div className="h-[220px] rounded-xl border border-gray-800 bg-gray-950 flex items-center justify-center text-gray-500 text-sm font-bold">
                                NO_IMAGE
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="text-xs font-bold text-gray-500">APPROVAL</div>

                        <form
                            action={handleApproveRequest.bind(null, r.id)}
                            className="space-y-2"
                        >
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Approved Credits</label>
                            <Input
                                name="approvedCredits"
                                type="number"
                                defaultValue={r.requested_credits}
                                className="bg-gray-950 border-gray-800 text-white"
                                min={1}
                                required
                                disabled={r.status !== "pending"}
                            />

                            <label className="text-[10px] font-bold text-gray-500 uppercase">Admin Note</label>
                            <Input
                                name="adminNote"
                                type="text"
                                placeholder="optional"
                                defaultValue={r.admin_note || ""}
                                className="bg-gray-950 border-gray-800 text-white"
                                disabled={r.status !== "pending"}
                            />

                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                                    disabled={r.status !== "pending"}
                                >
                                    APPROVE
                                </Button>
                            </div>
                        </form>

                        <form
                            action={handleRejectRequest.bind(null, r.id)}
                            className="space-y-2"
                        >
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Reject Note</label>
                            <Input
                                name="adminNoteReject"
                                type="text"
                                placeholder="reason"
                                className="bg-gray-950 border-gray-800 text-white"
                                disabled={r.status !== "pending"}
                            />
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full font-bold"
                                disabled={r.status !== "pending"}
                            >
                                REJECT
                            </Button>
                        </form>

                        {r.status !== "pending" && (
                            <div className="pt-2 text-xs text-gray-500 font-bold">
                                FINAL: {String(r.status).toUpperCase()} {r.approved_at ? `@ ${new Date(r.approved_at).toLocaleString()}` : ""}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
