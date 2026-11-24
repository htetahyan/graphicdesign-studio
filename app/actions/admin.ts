"use server"

import { checkAdminSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { eq, ilike, desc, sql } from "drizzle-orm"
import { db, users } from "@/lib/db"

export async function getUsers() {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    try {
        const result = await db.query.users.findMany({
            orderBy: [desc(users.createdAt)],
        })

        return result.map((u) => ({
            ...u,
            status: u.isBlocked ? "blocked" : "active"
        }))
    } catch (err: any) {
        console.error("Fatal error fetching users:", err?.message || err)
        return []
    }
}

export async function getUsersPaginated({
    limit = 15,
    offset = 0,
    search = "",
}: {
    limit?: number
    offset?: number
    search?: string
}) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) redirect("/admin/login")

    try {
        const whereClause = search
            ? ilike(users.username, `%${search}%`)
            : undefined

        const [result, countResult] = await Promise.all([
            db.query.users.findMany({
                where: whereClause,
                orderBy: [desc(users.createdAt)],
                limit,
                offset,
            }),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(users)
                .where(whereClause),
        ])

        const mapped = result.map((u) => ({ ...u, status: u.isBlocked ? "blocked" : "active" }))
        return { users: mapped, total: countResult[0]?.count || 0 }
    } catch (err: any) {
        console.error("Fatal error fetching users:", err?.message || err)
        return { users: [], total: 0 }
    }
}

export async function updateUserCredits(userId: string, amount: number) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { credits: true },
    })
    if (!user) return { error: "User not found" }

    const newCredits = (user.credits || 0) + amount

    await db
        .update(users)
        .set({ credits: newCredits })
        .where(eq(users.id, userId))

    revalidatePath("/admin")
    return { success: true }
}

export async function deleteUser(userId: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    await db.delete(users).where(eq(users.id, userId))

    revalidatePath("/admin")
    return { success: true }
}

export async function createUser(formData: FormData) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const credits = Number(formData.get("credits") || 10)

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await db.insert(users).values({
            username,
            passphrase: hashedPassword,
            credits,
        })
    } catch (error: any) {
        console.error("Create user error:", error)
        throw new Error("Failed to create user: " + error.message)
    }

    revalidatePath("/admin")
    return { success: true }
}

export async function changeUserPassword(userId: string, newPassword: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    if (!newPassword || newPassword.length < 4) {
        return { error: "Password must be at least 4 characters" }
    }

    // Hash the new password before storing
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db
        .update(users)
        .set({ passphrase: hashedPassword })
        .where(eq(users.id, userId))

    revalidatePath("/admin")
    return { success: true }
}

export async function setUserCredits(userId: string, credits: number) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    if (credits < 0) return { error: "Credits cannot be negative" }

    await db
        .update(users)
        .set({ credits })
        .where(eq(users.id, userId))

    revalidatePath("/admin")
    return { success: true }
}

import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/session"

export async function impersonateUser(userId: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true },
    })
    if (!user) throw new Error("User not found")

    const cookieStore = await cookies()
    
    // Log out previous user first as requested
    cookieStore.delete("user_session")
    cookieStore.delete("user_id")

    // Create new session for the target user
    const token = await createSessionToken({
        role: "user",
        userId: user.id,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    })

    cookieStore.set("user_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    })

    redirect("/gallery")
}

export async function toggleBlockUser(userId: string) {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) throw new Error("Unauthorized")

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { isBlocked: true },
    })
    if (!user) return { error: "User not found" }

    await db
        .update(users)
        .set({ isBlocked: !user.isBlocked })
        .where(eq(users.id, userId))

    revalidatePath("/admin")
    return { success: true }
}
