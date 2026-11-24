"use client"

import { Button } from "@/components/ui/button"

export function DeleteUserButton({ userId, username, deleteAction }: {
    userId: string
    username: string
    deleteAction: (userId: string) => Promise<void>
}) {
    return (
        <Button
            size="sm"
            variant="destructive"
            className="h-7 text-[10px] px-2"
            onClick={async () => {
                if (confirm(`Delete user "${username}"? This cannot be undone.`)) {
                    await deleteAction(userId)
                }
            }}
        >
            DEL
        </Button>
    )
}
