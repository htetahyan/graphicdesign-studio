"use client"

import Link from "next/link"
import { ArrowLeft, HelpCircle, MessageCircle, Zap } from "lucide-react"
import { CopyablePhone } from "@/components/ui/copyable-phone"

export default function HelpPage() {
    const faqs = [
        {
            question: "How do I create my first design?",
            answer: "First, create a brand profile with your logo and brand images. Then go to the Generate page, select your brand, enter a prompt describing what you want, and click Generate."
        },
        {
            question: "How many credits does each design cost?",
            answer: "Each design generation costs 10 credits. You can recharge your credits from the Gallery page or Profile section."
        },
        {
            question: "Can I use my own images as reference?",
            answer: "Yes! When generating a design, you can upload up to 3 reference images to guide the AI in creating your design."
        },
        {
            question: "What image formats are supported?",
            answer: "Generated images are saved in high-quality PNG format. You can download them directly to your device."
        },
        {
            question: "How do I edit my brand?",
            answer: "Go to Gallery, find your brand card, and click the Edit button. You can update your brand name and logo."
        }
    ]

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
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Help</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl lg:text-5xl font-serif tracking-tight text-foreground">
                        Help Center
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Find answers to common questions and get support.
                    </p>
                </div>

                {/* FAQs */}
                <div className="space-y-8 mb-16">
                    {faqs.map((faq, i) => (
                        <div key={i} className="space-y-3 group">
                            <h2 className="text-xl font-serif text-foreground flex items-start gap-3">
                                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                {faq.question}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed pl-8">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-card border border-border rounded-md p-8 md:p-12 text-center shadow-sm">
                    <div className="space-y-2 mb-8">
                        <h2 className="text-2xl font-serif text-foreground">Still need help?</h2>
                        <p className="text-muted-foreground">Contact our team for personalized assistance.</p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Viber / Phone</span>
                            </div>
                            <CopyablePhone
                                phone="09449984352"
                                className="text-3xl font-serif font-bold tracking-tight text-foreground"
                                iconClassName="w-6 h-6 text-muted-foreground hover:text-primary transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <a
                                href="tel:09449984352"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-secondary border border-border rounded-md text-sm font-bold text-foreground hover:bg-accent transition-all active:scale-[0.98]"
                            >
                                <MessageCircle className="h-4 w-4" />
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
