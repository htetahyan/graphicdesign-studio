import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteBrandZoneProps {
  showConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
  isDeleting: boolean;
  onDelete: () => void;
}

export function DeleteBrandZone({
  showConfirm,
  setShowConfirm,
  isDeleting,
  onDelete,
}: DeleteBrandZoneProps) {
  return (
    <div className="pt-8 border-t border-border">
      <label className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4 block">
        Bad Process
      </label>

      {showConfirm ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-4">
          <p className="text-sm text-red-400 font-medium">brand ကို ဖျက်မယ်</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1 h-11 rounded-xl border-border bg-secondary text-foreground hover:bg-accent"
            >
              မလုပ်တော့ပါ
            </Button>
            <Button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "ဖျက်မည်"}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 text-red-400 text-sm font-bold px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors w-full justify-center border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          brand ဖျက်ရန်
        </button>
      )}
    </div>
  );
}
