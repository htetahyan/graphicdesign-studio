"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobStackProps {
  stackCount: number;
  activeJobs: string[];
  aspectRatio: string;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export function JobStack({
  stackCount,
  activeJobs,
  aspectRatio,
  showToast,
}: JobStackProps) {
  const stackArray = Array.from({ length: stackCount });

  return (
    <AnimatePresence mode="popLayout">
      {stackCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          {stackArray.map((_, idx) => {
            const reverseIdx = idx + 1;
            const jobId = activeJobs[idx];

            return (
              <motion.div
                key={jobId || `stack-${idx}`}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{
                  opacity: 1 - reverseIdx * 0.22,
                  scale: 1 - reverseIdx * 0.04,
                  rotate: reverseIdx % 2 === 0 ? 3 : -3,
                  y: -reverseIdx * 14,
                  x: reverseIdx % 2 === 0 ? 10 : -10,
                  zIndex: -reverseIdx,
                }}
                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute inset-0 bg-card border border-border shadow-md rounded-md flex items-center justify-center pointer-events-none"
                style={{ aspectRatio: aspectRatio.replace(":", "/") }}
              >
                <div className="w-[calc(100%-1rem)] h-[calc(100%-1rem)] flex items-center justify-center bg-accent/30 rounded-sm border border-dashed border-border/40">
                  <Loader2 className="w-6 h-6 text-muted-foreground/35 animate-[spin_3s_linear_infinite]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
