import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/session"

export async function checkAdminSession(): Promise<boolean> {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) return false

    // Verify HMAC signature + expiry
    const payload = await verifySessionToken(token)
    if (!payload) return false

    return payload.role === "admin"
}
