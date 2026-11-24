"use client"

import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
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
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Privacy</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl lg:text-5xl font-serif tracking-tight text-foreground">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: February 2024
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">We collect information you provide directly to us, including:</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex gap-3"><span className="text-primary">•</span> Account information (username, email)</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Brand profiles and uploaded images</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Generated designs and prompts</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Payment information for credit purchases</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex gap-3"><span className="text-primary">•</span> Provide and improve our services</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Process your design generation requests</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Communicate with you about your account</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Process payments and manage credits</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">3. Data Storage</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is stored securely using industry-standard encryption. Uploaded images and generated designs are stored in secure cloud storage and are only accessible by you.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">4. Third-Party Services</h2>
                        <p className="text-muted-foreground leading-relaxed">We use third-party services for:</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex gap-3"><span className="text-primary">•</span> Image generation for your designs</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Cloud storage (Supabase)</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Payment processing</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">5. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex gap-3"><span className="text-primary">•</span> Access your personal data</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Delete your account and associated data</li>
                            <li className="flex gap-3"><span className="text-primary">•</span> Export your designs and brand profiles</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">6. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
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
