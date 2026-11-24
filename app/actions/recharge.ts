"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import { getSessionUser } from "./user-auth"
import { revalidatePath } from "next/cache"
import { eq, and, asc, desc } from "drizzle-orm"
import { db, rechargePackages, rechargeRequests } from "@/lib/db"

export async function getRechargePackages() {
    const result = await db.query.rechargePackages.findMany({
        where: eq(rechargePackages.isActive, true),
        orderBy: [asc(rechargePackages.sortOrder)],
    })
    
    return result.map(p => ({
        id: p.id,
        title: p.title,
        priceKs: p.priceKs,
        credits: p.credits,
        is_active: p.isActive,
        sort_order: p.sortOrder,
        created_at: p.createdAt.toISOString()
    }))
}

export async function getMyRechargeRequests(limit = 10) {
    const user = await getSessionUser()
    if (!user) throw new Error("Unauthorized")

    const result = await db.query.rechargeRequests.findMany({
        where: eq(rechargeRequests.userId, user.id),
        with: {
            package: {
                columns: { id: true, title: true, priceKs: true, credits: true },
            },
        },
        orderBy: [desc(rechargeRequests.createdAt)],
        limit,
    })

    return result.map((r) => ({
        id: r.id,
        status: r.status as "pending" | "approved" | "rejected",
        requested_ks: r.requestedKs ?? 0,
        requested_credits: r.requestedCredits ?? 0,
        approved_credits: r.approvedCredits ?? 0,
        admin_note: r.adminNote,
        created_at: r.createdAt.toISOString(),
        approved_at: r.approvedAt ? r.approvedAt.toISOString() : null,
        package: r.package,
    }))
}

export async function createRechargeRequest(prevState: any, formData: FormData) {
    const user = await getSessionUser() as { id: string; username: string; credits: number } | null
    if (!user) return { error: "Unauthorized" }

    const packageId = (formData.get("packageId") as string | null) || ""
    const screenshot = formData.get("screenshot") as File | null

    if (!packageId) {
        return { error: "Package ကို ရွေးပါ" }
    }

    if (!screenshot || screenshot.size === 0) {
        return { error: "Payment receipt screenshot ကို တင်ပါ" }
    }

    if (!screenshot.type.startsWith("image/")) {
        return { error: "Image ဖိုင်သာ တင်နိုင်ပါတယ်" }
    }

    const pkg = await db.query.rechargePackages.findFirst({
        where: eq(rechargePackages.id, packageId),
        columns: { id: true, priceKs: true, credits: true, isActive: true },
    })

    if (!pkg || !pkg.isActive) {
        return { error: "Package မမှန်ပါ" }
    }

    const designCount = Number(pkg.credits || 0)
    const internalCredits = designCount * 10

    const [request] = await db
        .insert(rechargeRequests)
        .values({
            userId: user.id,
            packageId: pkg.id,
            paymentScreenshotPath: "pending",
            requestedKs: pkg.priceKs,
            requestedCredits: internalCredits,
            status: "pending",
        })
        .returning({ id: rechargeRequests.id })

    if (!request) {
        console.error("Create recharge request failed")
        return { error: "Request တင်လို့မရပါ (Failed)" }
    }

    const safeName = screenshot.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const objectPath = `recharges/${user.id}/${request.id}-${Date.now()}-${safeName}`

    const { error: uploadError } = await supabaseAdmin.storage
        .from("payments")
        .upload(objectPath, screenshot, { upsert: false, contentType: screenshot.type })

    if (uploadError) {
        console.error("Upload payment screenshot failed:", uploadError)
        await db
            .delete(rechargeRequests)
            .where(and(
                eq(rechargeRequests.id, request.id),
                eq(rechargeRequests.userId, user.id)
            ))

        return { error: "Screenshot တင်မရပါ (Upload failed)" }
    }

    await db
        .update(rechargeRequests)
        .set({ paymentScreenshotPath: objectPath })
        .where(and(
            eq(rechargeRequests.id, request.id),
            eq(rechargeRequests.userId, user.id)
        ))

    revalidatePath("/gallery")
    revalidatePath("/recharge")

    return { success: true }
}
