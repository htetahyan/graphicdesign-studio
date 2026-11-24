export type RechargePackage = {
    id: string
    title: string
    priceKs: number
    credits: number
}

export type RechargeRequest = {
    id: string
    status: "pending" | "approved" | "rejected"
    requested_ks: number
    requested_credits: number
    approved_credits: number | null
    admin_note: string | null
    created_at: string
    approved_at: string | null
    package?: RechargePackage | null
}
