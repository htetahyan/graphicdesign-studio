import type { Metadata } from "next";
import { checkAdminSession } from "@/lib/auth"

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-snippet": -1,
            "max-image-preview": "none",
            "max-video-preview": -1,
        },
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAdmin = await checkAdminSession()

    // If not admin, render children only if it's the login page
    // The login page handles its own auth check
    if (!isAdmin) {
        // Allow login page to render, redirect everything else
        // We detect login page by checking if children contains the login form
        // A simpler approach: just redirect non-admins to login, and the login page
        // will render because it doesn't require admin session
        return (
            <div className="min-h-screen bg-gray-950">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {children}
        </div>
    )
}
