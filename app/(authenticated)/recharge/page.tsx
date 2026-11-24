import { getRechargePackages, getMyRechargeRequests } from "@/app/actions/recharge"
import { getSessionUser } from "@/app/actions/user-auth"
import { redirect } from "next/navigation"
import { RechargeClient } from "@/components/recharge/recharge-client"

export default async function RechargePage() {
    const user = await getSessionUser()
    if (!user) redirect("/login")

    const packages = await getRechargePackages()
    const requests = await getMyRechargeRequests(10)

    return <RechargeClient user={user} packages={packages} requests={requests} />
}
