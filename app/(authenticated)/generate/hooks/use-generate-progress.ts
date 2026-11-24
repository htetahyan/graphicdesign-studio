import { useState, useEffect } from "react";

export function useGenerateProgress(activeJobsCount: number) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (activeJobsCount === 0) {
      setProgressValue(0);
      return;
    }

    // Reset progress to a lower value when a new job starts or finishes to show movement for the NEXT job
    setProgressValue(v => (v > 80 ? 40 : v));

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const capped = 90;
      // Reaches 90% in 30 seconds
      const next = Math.min(capped, 10 + (elapsed / 30000) * 80);
      setProgressValue((prev) => (next > prev ? next : prev));
    }, 200);

    return () => window.clearInterval(timer);
  }, [activeJobsCount]);

  return progressValue;
}
