"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { checkJobStatus } from "@/app/actions/generate";
import type { GenerateResult, ChatTurn } from "../types";

export function useQueuedJobs({
  activeJobs,
  setActiveJobs,
  setImageLoaded,
  setResult,
  setRecentGenerations,
  setChatTurns,
  setGenerationError,
  showToast,
  router,
  resultDataRef,
}: {
  activeJobs: string[];
  setActiveJobs: React.Dispatch<React.SetStateAction<string[]>>;
  setImageLoaded: (loaded: boolean) => void;
  setResult: (result: GenerateResult | null) => void;
  setRecentGenerations: React.Dispatch<React.SetStateAction<GenerateResult[]>>;
  setChatTurns?: React.Dispatch<React.SetStateAction<ChatTurn[]>>;
  setGenerationError: (err: string | null) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
  router: any;
  resultDataRef: React.MutableRefObject<GenerateResult | null>;
}) {
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (activeJobs.length === 0) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    const jobChannels: Record<string, any> = {};
    const fallbackIntervals: Record<string, NodeJS.Timeout> = {};

    activeJobs.forEach((jobId) => {
      if (jobChannels[jobId]) return;

      fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" })
        .catch((e) => console.error(`Worker kickstart failed for ${jobId}:`, e));

      const channel = supabase
        .channel(`job-${jobId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "generation_jobs",
            filter: `id=eq.${jobId}`,
          },
          async (payload) => {
            const newStatus = payload.new.status;
            if (newStatus === "completed" || newStatus === "failed") {
              handleJobFinished(jobId);
            }
          },
        )
        .subscribe();

      jobChannels[jobId] = channel;

      fallbackIntervals[jobId] = setInterval(async () => {
        try {
          const { status } = await checkJobStatus(jobId);
          if (status === "completed" || status === "failed") {
            handleJobFinished(jobId);
          } else if (status === "pending") {
            fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" }).catch(() => {});
          }
        } catch (e) {
          /* ignore */
        }
      }, 4000);
    });

    async function handleJobFinished(jobId: string) {
      if (fallbackIntervals[jobId]) {
        clearInterval(fallbackIntervals[jobId]);
        delete fallbackIntervals[jobId];
      }

      try {
        const { status, generation, error } = await checkJobStatus(jobId);

        if (status === "completed" && generation) {
          const genResult = generation as GenerateResult;
          setImageLoaded(false);
          setResult(genResult);
          setRecentGenerations((prev) => {
            if (prev.some((g) => g.id === (genResult as any).id)) return prev;
            return [genResult, ...prev];
          });
          if (setChatTurns) {
            setChatTurns((prev) =>
              prev.map((turn) => {
                if (!turn.jobIds.includes(jobId)) return turn;
                const alreadyExists = turn.results.some((r) => r.id === genResult.id);
                const nextResults = alreadyExists
                  ? turn.results
                  : [...turn.results, genResult].sort(
                      (a, b) =>
                        ((a.params as any)?.slideIndex ?? 0) -
                        ((b.params as any)?.slideIndex ?? 0)
                    );
                const allDone = nextResults.length >= turn.jobIds.length;
                return {
                  ...turn,
                  results: nextResults,
                  status: allDone ? "completed" : "generating",
                };
              })
            );
          }
          resultDataRef.current = genResult;
          showToast("✨ ပုံဖန်တီးခြင်း အောင်မြင်ပါသည်!", "success");
        } else if (status === "failed") {
          const errMsg = error || "လုပ်ငန်းစဉ် မအောင်မြင်ပါ";
          setGenerationError(errMsg);
          if (setChatTurns) {
            setChatTurns((prev) =>
              prev.map((turn) =>
                turn.jobIds.includes(jobId)
                  ? {
                      ...turn,
                      status: turn.results.length > 0 ? "completed" : "failed",
                      error: errMsg,
                    }
                  : turn
              )
            );
          }
          showToast(errMsg, "error");
        }

        setActiveJobs((prev) => prev.filter((id) => id !== jobId));
      } catch (err) {
        console.error(`Error finishing job ${jobId}:`, err);
        setActiveJobs((prev) => prev.filter((id) => id !== jobId));
      }
    }

    return () => {
      Object.values(jobChannels).forEach((channel) =>
        supabase.removeChannel(channel),
      );
      Object.values(fallbackIntervals).forEach((interval) =>
        clearInterval(interval),
      );
    };
  }, [activeJobs.length, showToast, router]);

  useEffect(() => {
    if (activeJobs.length === 0) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "ပုံဖန်တီးခြင်းလုပ်ဆောင်နေဆဲဖြစ်သဖြင့် စာမျက်နှာမှထွက်ခွာပါက အဆင်မပြေမှုရှိနိုင်ပါသည်။ (Design generation is in progress. Leaving this page might interrupt the process.)";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeJobs.length]);

  return { isPolling };
}
