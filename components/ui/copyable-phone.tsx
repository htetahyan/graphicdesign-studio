"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyablePhoneProps {
  phone: string;
  className?: string;
  iconClassName?: string;
}

export function CopyablePhone({ phone, className, iconClassName }: CopyablePhoneProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("inline-flex items-center gap-2 group", className)}>
      <span>{phone}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded-md opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all focus:outline-none"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className={cn("w-4 h-4 text-green-500", iconClassName)} />
        ) : (
          <Copy className={cn("w-4 h-4", iconClassName)} />
        )}
      </button>
    </div>
  );
}
