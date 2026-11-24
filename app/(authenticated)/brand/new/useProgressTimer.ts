"use client";

import { useState, useEffect } from "react";

export function useProgressTimer(isPending: boolean) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (!isPending) {
      setProgressValue(0);
      return;
    }

    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const capped = 90;
      const next = Math.min(capped, 10 + (elapsed / 30000) * 80);

      setProgressValue((prev) => (next > prev ? next : prev));
    }, 200);

    return () => window.clearInterval(timer);
  }, [isPending]);

  return progressValue;
}
