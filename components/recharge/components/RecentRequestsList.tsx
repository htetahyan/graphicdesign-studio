import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { RechargeRequest } from "../types";

interface RecentRequestsListProps {
  requests: RechargeRequest[];
}

export function RecentRequestsList({ requests }: RecentRequestsListProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="bg-secondary/60 px-4 py-2 border-b border-border flex items-center justify-between">
        <h2 className="text-xs font-black text-muted-foreground uppercase tracking-wider">Recent Requests</h2>
      </div>
      <div className="p-2 space-y-1.5 max-h-[14rem] overflow-y-auto bg-card min-h-[5rem]">
        {requests.length === 0 ? (
          <p className="text-[11px] text-center text-muted-foreground font-medium py-3">လတ်တလော Credit ဖြည့်သွင်းထားမှု မရှိပါ။</p>
        ) : (
          requests.map((r) => {
            const isApproved = r.status === "approved";
            const isRejected = r.status === "rejected";

            return (
              <div key={r.id} className="rounded-xl p-2 bg-secondary/60 border border-border flex items-center justify-between transition-colors hover:bg-secondary">
                <div className="flex items-center gap-2.5">
                  {isApproved ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isRejected ? (
                    <XCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-400" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-foreground leading-none">{r.package?.title}</span>
                    <span className="text-[10px] font-bold text-muted-foreground mt-0.5">AED {r.requested_ks.toLocaleString()}</span>
                    {r.admin_note && <span className="text-[9px] text-red-400 font-bold mt-0.5 max-w-[150px] truncate">{r.admin_note}</span>}
                  </div>
                </div>
                <div className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                  isApproved ? "bg-emerald-500/15 text-emerald-400" : isRejected ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"
                )}>
                  {r.status}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
