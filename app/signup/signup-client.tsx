"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useActionState } from "react"
import { signupUser } from "@/app/actions/user-auth"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
    const [state, action, isPending] = useActionState(signupUser, null)
    const [showPass, setShowPass] = useState(false)

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background relative selection:bg-primary/20">
            {/* Minimal Header */}
            <div className="absolute top-8 w-full flex justify-center">
                <Link href="/" className="transition-opacity hover:opacity-80">
                    <Image
                        src="/logo.png"
                        alt="Yaung Sone AI Studio Logo"
                        width={180}
                        height={80}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Main Form Container */}
            <div className="w-full max-w-[400px] mt-16 sm:mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign up to start generating premium AI designs.
                    </p>
                </div>

                <form suppressHydrationWarning action={action} className="space-y-5" noValidate>
                    <div className="space-y-4">
                        <div className="relative group">
                            <FloatingInput
                                name="username"
                                id="username"
                                label="Username"
                                type="text"
                                required
                                minLength={3}
                                autoComplete="username"
                                inputMode="text"
                                disabled={isPending}
                                aria-invalid={Boolean(state?.error)}
                                aria-describedby={state?.error ? "signup-error" : undefined}
                                className="h-12 rounded-md bg-secondary/60 border-border text-foreground shadow-sm text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                            />
                        </div>

                        <div className="relative group">
                            <FloatingInput
                                name="passphrase"
                                id="passphrase"
                                label="Create password"
                                type={showPass ? "text" : "password"}
                                required
                                minLength={6}
                                autoComplete="new-password"
                                disabled={isPending}
                                aria-invalid={Boolean(state?.error)}
                                aria-describedby={state?.error ? "signup-error" : undefined}
                                className="h-12 rounded-md bg-secondary/60 border-border text-foreground shadow-sm text-base pr-12 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
                                aria-label={showPass ? "Hide password" : "Show password"}
                                disabled={isPending}
                            >
                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex items-center animate-in fade-in">
                            <span id="signup-error">{state.error}</span>
                        </div>
                    )}

                    <Button
                        disabled={isPending}
                        className="w-full h-12 text-base font-medium rounded-md shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                    >
                        {isPending ? "Creating account..." : "Create Account"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms</Link> and{" "}
                        <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
                    </p>
                </form>
            </div>
            <div className="pt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground font-medium hover:underline hover:underline-offset-4 transition-all">
                    Sign in
                </Link>
            </div>
        </div>

    )
}
