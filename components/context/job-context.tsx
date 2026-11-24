"use client"

import React, { useContext, useState, useEffect, useCallback, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { checkJobStatus } from "@/app/actions/generate"
import { getActiveJobs } from "@/app/actions/user-auth"
import { useUI } from "./ui-context"
import { useRouter } from "next/navigation"
import type { GenerateResult } from "@/app/(authenticated)/generate/types"
import { Job, JobContext, useJobProgress } from "./job-context-utils"

export function JobProvider({ children, userId }: { children: React.ReactNode, userId: string }) {
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [completedResult, setCompletedResult] = useState<GenerateResult | null>(null)
  
  const { showToast } = useUI()
  const router = useRouter()
  
  // Ref to track jobs locally to avoid stale closures in intervals
  const activeJobsRef = useRef<Job[]>([])

  const { progressValue, setProgressValue } = useJobProgress(activeJobs.length)

  // Load initial active jobs
  useEffect(() => {
    if (!userId) return;
    getActiveJobs().then(jobs => {
        setActiveJobs(jobs)
        activeJobsRef.current = jobs
    }).catch(console.error)
  }, [userId])

  // Realtime Subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('global-jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generation_jobs',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newJob = { id: payload.new.id, status: payload.new.status, prompt: payload.new.prompt, created_at: payload.new.created_at };
            setActiveJobs(prev => {
                if (prev.some(j => j.id === newJob.id)) return prev;
                const next = [newJob, ...prev];
                activeJobsRef.current = next;
                return next;
            });
            // Notch progress backward slightly to show it's handling a new job
            setProgressValue(v => (v > 80 ? 40 : v));
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            if (newStatus === 'completed' || newStatus === 'failed') {
               handleJobFinished(payload.new.id);
            } else {
               setActiveJobs(prev => {
                   const next = prev.map(j => j.id === payload.new.id ? { ...j, status: newStatus } : j);
                   activeJobsRef.current = next;
                   return next;
               });
            }
          } else if (payload.eventType === 'DELETE') {
            setActiveJobs(prev => {
                const next = prev.filter(j => j.id !== payload.old.id);
                activeJobsRef.current = next;
                return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Fallback Polling for Active Jobs (in case Realtime fails)
  useEffect(() => {
      const interval = setInterval(() => {
          const currentJobs = activeJobsRef.current;
          if (currentJobs.length === 0) return;
          
          currentJobs.forEach(async (job) => {
             try {
                const { status } = await checkJobStatus(job.id);
                if (status === 'completed' || status === 'failed') {
                     handleJobFinished(job.id);
                } else if (status === 'pending') {
                     fetch(`/api/process-job?jobId=${job.id}`, { method: "POST" }).catch(() => {});
                }
             } catch (e) { /* ignore */ }
          });
      }, 5000);

      return () => clearInterval(interval);
  }, []); // Run regardless of length, it checks the ref

  const handleJobFinished = async (jobId: string) => {
    try {
      const { status, generation, error } = await checkJobStatus(jobId);
      
      if (status === "completed" && generation) {
        showToast("✨ ပုံဖန်တီးခြင်း အောင်မြင်ပါသည်!", "success");
        setCompletedResult(generation as GenerateResult);
      } else if (status === "failed") {
        showToast(error || "လုပ်ငန်းစဉ် မအောင်မြင်ပါ", "error");
      }
      
      setActiveJobs(prev => {
          const next = prev.filter(id => id.id !== jobId);
          activeJobsRef.current = next;
          // Notch progress backward when a job finishes and another is still running
          if (next.length > 0) {
              setProgressValue(v => (v > 80 ? 40 : v));
          } else {
              setProgressValue(0);
          }
          return next;
      });

      // Give a tiny delay for DB replication then refresh the route to update gallery/credits
      setTimeout(() => {
         router.refresh();
      }, 500);

    } catch (err) {
      console.error(`Error finishing job ${jobId}:`, err);
      setActiveJobs(prev => {
          const next = prev.filter(id => id.id !== jobId);
          activeJobsRef.current = next;
          return next;
      });
    }
  }

  const addJob = useCallback((jobId: string, prompt: string) => {
      const newJob = { id: jobId, status: 'pending', prompt };
      setActiveJobs(prev => {
          if (prev.some(j => j.id === jobId)) return prev;
          const next = [newJob, ...prev];
          activeJobsRef.current = next;
          return next;
      });
      // Force kickstart
      fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" }).catch(() => {});
  }, []);

  return (
    <JobContext.Provider value={{ activeJobs, progressValue, addJob, completedResult, setCompletedResult }}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  return useContext(JobContext)
}