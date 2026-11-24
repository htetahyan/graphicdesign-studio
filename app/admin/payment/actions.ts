"use server"

import { redirect } from "next/navigation"
import { approveRechargeRequest, rejectRechargeRequest } from "@/app/actions/admin-payments"

export async function handleApproveRequest(requestId: string, formData: FormData) {
    const creditsStr = String(formData.get("approvedCredits") || "")
    const note = String(formData.get("adminNote") || "")
    const credits = Number(creditsStr)
    
    const result = await approveRechargeRequest(requestId, credits, note)
    
    if (!result.success) {
        // Redirect with error message in query params
        redirect(`/admin/payment?error=${encodeURIComponent(result.error || "Unknown error")}`)
    }
    
    redirect("/admin/payment?success=approved")
}

export async function handleRejectRequest(requestId: string, formData: FormData) {
    const note = String(formData.get("adminNoteReject") || "")
    
    const result = await rejectRechargeRequest(requestId, note)
    
    if (!result.success) {
        redirect(`/admin/payment?error=${encodeURIComponent(result.error || "Unknown error")}`)
    }
    
    redirect("/admin/payment?success=rejected")
}
