"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface Toast {
    id: string
    message: string
    type: "success" | "error" | "warning" | "info"
    duration?: number
}

interface UIContextType {
    isSidebarOpen: boolean
    openSidebar: () => void
    closeSidebar: () => void
    toggleSidebar: () => void
    toasts: Toast[]
    showToast: (message: string, type: Toast["type"], duration?: number) => void
    removeToast: (id: string) => void
}

const noop = () => {}
const UIContext = createContext<UIContextType>({
    isSidebarOpen: false,
    openSidebar: noop,
    closeSidebar: noop,
    toggleSidebar: noop,
    toasts: [],
    showToast: noop as any,
    removeToast: noop,
})

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [toasts, setToasts] = useState<Toast[]>([])

    const openSidebar = () => setIsSidebarOpen(true)
    const closeSidebar = () => setIsSidebarOpen(false)
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

    const showToast = useCallback((message: string, type: Toast["type"] = "info", duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9)
        const toast: Toast = { id, message, type, duration }
        setToasts(prev => [...prev, toast])

        setTimeout(() => {
            removeToast(id)
        }, duration)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <UIContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar, toasts, showToast, removeToast }}>
            {children}
        </UIContext.Provider>
    )
}

export function useUI() {
    return useContext(UIContext)
}
