"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface FloatingInputProps extends React.ComponentProps<"input"> {
    label: string
    labelClassName?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, label, labelClassName, type, ...props }, ref) => {
        // Generate a unique ID for the input if not provided, to link label
        const id = React.useId()

        return (
            <div className="relative">
                <Input
                    type={type}
                    id={props.id || id}
                    className={cn(
                        "peer pt-6 pb-2 h-14", // Increased height and adjusted padding
                        className
                    )}
                    placeholder=" " // Required for peer-placeholder-shown
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={props.id || id}
                    className={cn(
                        "absolute left-3 top-4 text-muted-foreground z-10 origin-[0] -translate-y-2.5 scale-75 transform cursor-text select-none bg-transparent px-1 text-sm duration-200",
                        "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
                        "peer-focus:top-4 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary",
                        "peer-focus:px-0", // Adjust label position
                        labelClassName
                    )}
                >
                    {label}
                </label>
            </div>
        )
    }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
