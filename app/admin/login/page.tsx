"use client"

import { useActionState } from "react"
import { loginAdmin } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
    const [state, action, isPending] = useActionState(loginAdmin, null)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
            <Card className="w-full max-w-sm border-gray-800 bg-gray-900 text-white">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <ShieldAlert className="h-10 w-10 text-red-500" />
                    </div>
                    <CardTitle className="text-xl text-red-500">Restricted Access</CardTitle>
                    <CardDescription className="text-gray-400">
                        Authorized Personnel Only
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                name="password"
                                type="password"
                                placeholder="Admin Secret Key"
                                className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-600 focus:border-red-900 focus:ring-red-900/20"
                                required
                            />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium text-center">{state.error}</p>
                        )}
                        <Button
                            disabled={isPending}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            {isPending ? "Verifying..." : "Access Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
