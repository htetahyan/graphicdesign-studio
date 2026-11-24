"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MessageCircle, Phone } from "lucide-react"
import { CopyablePhone } from "@/components/ui/copyable-phone"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
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

            {/* Main Content Container */}
            <div className="w-full max-w-[400px] mt-16 sm:mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                        Reset password
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Contact us to manually verify and reset your password.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-accent/50 border border-border rounded-md p-4 text-center">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            For security reasons, password resets require manual verification by our support team.
                        </p>
                    </div>

                    {/* Contact Options */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-md p-6 text-center shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-3 text-muted-foreground">
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Viber / Phone</span>
                            </div>
                            <CopyablePhone
                                phone="09449984352"
                                className="text-3xl font-serif font-bold tracking-tight text-foreground"
                                iconClassName="w-6 h-6 text-muted-foreground hover:text-primary transition-colors"
                            />
                            <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">Click icon to copy number</p>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href="tel:09449984352"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-secondary border border-border rounded-md text-sm font-bold text-foreground hover:bg-accent transition-all active:scale-[0.98]"
                            >
                                <Phone className="h-4 w-4" />
                                Call Now
                            </a>
                            <a
                                href="viber://chat?number=09449984352"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:opacity-90 transition-all active:scale-[0.98]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Viber
                            </a>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline hover:underline-offset-4 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return to login
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
        </div>
    )
}
