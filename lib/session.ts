/**
 * HMAC-SHA256 Signed Session Tokens
 * 
 * Compatible with BOTH Edge and Node.js runtimes via Web Crypto API.
 * Token format: base64url(payload).base64url(hmac)
 */

const SESSION_SECRET_ENV = process.env.SESSION_SECRET

if (!SESSION_SECRET_ENV) {
    throw new Error("SESSION_SECRET must be set in environment variables")
}

const SESSION_SECRET: string = SESSION_SECRET_ENV

// ─── Encoding helpers (Edge-safe, no Buffer dependency) ───

function base64UrlEncode(data: Uint8Array): string {
    // Use btoa which is available in both Edge and Node 16+
    let binary = ""
    for (const byte of data) {
        binary += String.fromCharCode(byte)
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

function base64UrlDecode(str: string): Uint8Array<ArrayBuffer> {
    // Restore standard base64
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
    // Add padding
    while (base64.length % 4) base64 += "="
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

function textEncode(text: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode(text)
}

function textDecode(data: Uint8Array): string {
    return new TextDecoder().decode(data)
}

// ─── Crypto helpers (Web Crypto API — works in Edge + Node 18+) ───

async function getHmacKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        "raw",
        textEncode(SESSION_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    )
}

async function hmacSign(data: string): Promise<string> {
    const key = await getHmacKey()
    const signature = await crypto.subtle.sign("HMAC", key, textEncode(data))
    return base64UrlEncode(new Uint8Array(signature))
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
    const key = await getHmacKey()
    return crypto.subtle.verify("HMAC", key, base64UrlDecode(signature), textEncode(data))
}

// ─── Public API ───

export interface SessionPayload {
    /** "admin" or "user" */
    role: "admin" | "user"
    /** User ID (only for user sessions) */
    userId?: string
    /** Expiration timestamp (ms since epoch) */
    exp: number
}

/**
 * Create a signed session token.
 * @returns token string in format `base64url(json_payload).base64url(hmac)`
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
    const payloadStr = JSON.stringify(payload)
    const payloadB64 = base64UrlEncode(textEncode(payloadStr))
    const signature = await hmacSign(payloadB64)
    return `${payloadB64}.${signature}`
}

/**
 * Verify a signed session token and return the payload.
 * Returns null if the token is invalid, tampered, or expired.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const parts = token.split(".")
        if (parts.length !== 2) return null

        const [payloadB64, signature] = parts

        // Verify HMAC signature
        const valid = await hmacVerify(payloadB64, signature)
        if (!valid) return null

        // Decode payload
        const payloadStr = textDecode(base64UrlDecode(payloadB64))
        const payload: SessionPayload = JSON.parse(payloadStr)

        // Check expiration
        if (!payload.exp || Date.now() > payload.exp) return null

        return payload
    } catch {
        return null
    }
}
