"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSessionToken } from "@/lib/session"

function readAdminSecret(): string | undefined {
    const secret = process.env.ADMIN_SECRET
    if (!secret) return undefined
    return secret
}

export async function loginAdmin(prevState: any, formData: FormData) {
    const password = formData.get("password")
    const adminSecret = readAdminSecret()

    // Simple delay to prevent timing attacks (mock)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (typeof password !== "string" || !adminSecret || password !== adminSecret) {
        return { error: "Invalid credentials" }
    }

    // Create HMAC-signed session token (24h expiry)
    const token = await createSessionToken({
        role: "admin",
        exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    })

    const cookieStore = await cookies()
    cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    })
    redirect("/admin")
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete("admin_token")
    // Also clean up the old cookie if it exists
    cookieStore.delete("admin_session")
    redirect("/admin/login")
}
