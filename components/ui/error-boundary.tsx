"use client"

import React from "react"
import { useUI } from "@/components/context/ui-context"

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="min-h-screen flex items-center justify-center bg-background p-6">
                        <div className="bg-card border border-border rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                            <div className="h-16 w-16 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">app error တတ် ေနပါသည်။</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                              ခန ေစာင့်ပြီးပြန်ဝင် ေပးပါ
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Refresh Page
                                </button>
                                <button
                                    onClick={() => this.setState({ hasError: false, error: null })}
                                    className="w-full h-12 bg-secondary text-foreground rounded-xl font-bold hover:bg-accent transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )
        }

        return this.props.children
    }
}
