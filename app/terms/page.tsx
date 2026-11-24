"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Terms</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl lg:text-5xl font-serif tracking-tight text-foreground">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: February 2024
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using Yaung Sone AI Studio, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">2. Use License</h2>
                        <p>Permission is granted to temporarily use Yaung Sone AI Studio for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul className="space-y-2">
                            <li className="flex gap-3"><span className="text-primary">•</span> Modify or copy the service materials</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Use the materials for any commercial purpose</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Attempt to decompile or reverse engineer any software</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Remove any copyright or proprietary notations</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">3. User Account</h2>
                        <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">4. Credits and Payments</h2>
                        <p>Credits are purchased in advance and are non-refundable. Each design generation costs 10 credits. Credits do not expire but may be forfeited if your account is terminated for violation of these terms.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">5. Generated Content</h2>
                        <p>You own the rights to designs you generate using our service. However, you are responsible for ensuring that your use of generated content does not infringe on any third-party rights. We are not liable for any copyright issues arising from your use of generated designs.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">6. Prohibited Uses</h2>
                        <p>You may not use Yaung Sone AI Studio:</p>
                        <ul className="space-y-2">
                            <li className="flex gap-3"><span className="text-primary">•</span> For any unlawful purpose</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> To generate harmful, offensive, or inappropriate content</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> To infringe upon intellectual property rights</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> To spam or harass others</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">7. Disclaimer</h2>
                        <p>Yaung Sone AI Studio is provided "as is" without any warranties, expressed or implied. We do not warrant that the service will be uninterrupted, secure, or error-free. We are not responsible for any damages arising from your use of the service.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">8. Contact</h2>
                        <p>For questions about these Terms, please contact us at:</p>
                        <p className="font-bold text-primary">support@graphicdesign.app</p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-border bg-accent/30 py-12">
                <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        © {new Date().getFullYear()} Yaung Sone AI Studio
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
                        <Link href="/privacy" className="text-foreground transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
