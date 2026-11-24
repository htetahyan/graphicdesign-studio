"use server"

import { checkAdminSession } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { eq, desc, sql, and } from "drizzle-orm"
import { db, rechargeRequests, users, rechargePackages, userNotifications } from "@/lib/db"

export async function getRechargeRequestsAdmin(limit = 100) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const result = await db.query.rechargeRequests.findMany({
        with: {
            user: {
                columns: { id: true, username: true, credits: true },
            },
            package: {
                columns: { id: true, title: true, priceKs: true, credits: true },
            },
        },
        orderBy: [desc(rechargeRequests.createdAt)],
        limit,
    })

    return result
}

export async function getRechargeRequestsAdminPage(params: {
    limit: number
    offset: number
    status?: "pending" | "approved" | "rejected" | "all"
}) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const { limit, offset, status } = params

    const whereClause = status && status !== "all"
        ? eq(rechargeRequests.status, status)
        : undefined

    const [result, countResult] = await Promise.all([
        db.query.rechargeRequests.findMany({
            where: whereClause,
            with: {
                user: {
                    columns: { id: true, username: true, credits: true },
                },
                package: {
                    columns: { id: true, title: true, priceKs: true, credits: true },
                },
            },
            orderBy: [desc(rechargeRequests.createdAt)],
            limit,
            offset,
        }),
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(rechargeRequests)
            .where(whereClause),
    ])

    return {
        rows: result,
        total: countResult[0]?.count || 0,
    }
}

export async function approveRechargeRequest(requestId: string, approvedCredits: number, adminNote?: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    if (!requestId) return { success: false, error: "Missing requestId" }
    if (!Number.isFinite(approvedCredits) || approvedCredits <= 0) {
        return { success: false, error: "Invalid approvedCredits" }
    }

    const req = await db.query.rechargeRequests.findFirst({
        where: eq(rechargeRequests.id, requestId),
        columns: { id: true, userId: true, status: true, requestedKs: true, requestedCredits: true },
    })

    if (!req) return { success: false, error: "Request not found" }
    if (req.status !== "pending") return { success: false, error: "Request is not pending" }

    const user = await db.query.users.findFirst({
        where: eq(users.id, req.userId),
        columns: { id: true, credits: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const nextCredits = (user.credits || 0) + approvedCredits

    await db.update(users).set({ credits: nextCredits }).where(eq(users.id, user.id))

    await db
        .update(rechargeRequests)
        .set({
            status: "approved",
            approvedCredits: approvedCredits,
            adminNote: adminNote || null,
            approvedBy: "admin",
            approvedAt: new Date(),
        })
        .where(eq(rechargeRequests.id, requestId))

    await db.insert(userNotifications).values({
        userId: user.id,
        type: "success",
        title: "Credits ပြည့်ပြီးပါပြီ",
        message: `${approvedCredits} Credits ထည့်ပြီးပါပြီ။ Gallery မှာ ဆက်လက်ဖန်တီးနိုင်ပါပြီ။`,
        isRead: false,
    })

    revalidatePath("/admin/payment")
    revalidatePath("/gallery")
    revalidatePath("/recharge")

    return { success: true }
}

export async function rejectRechargeRequest(requestId: string, adminNote?: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const req = await db.query.rechargeRequests.findFirst({
        where: eq(rechargeRequests.id, requestId),
        columns: { id: true, status: true },
    })

    if (!req) return { success: false, error: "Request not found" }
    if (req.status !== "pending") return { success: false, error: "Request is not pending" }

    await db
        .update(rechargeRequests)
        .set({
            status: "rejected",
            adminNote: adminNote || null,
            approvedBy: "admin",
            approvedAt: new Date(),
        })
        .where(eq(rechargeRequests.id, requestId))

    revalidatePath("/admin/payment")

    return { success: true }
}

export async function getPaymentScreenshotPublicUrl(objectPath: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    const { data } = supabase.storage.from("payments").getPublicUrl(objectPath)
    return data.publicUrl
}
