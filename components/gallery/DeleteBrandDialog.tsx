"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteBrandDialogProps {
  brandToDelete: any;
  setBrandToDelete: (brand: any) => void;
  isDeletingBrand: boolean;
  submitDeleteBrand: () => Promise<void>;
}

export function DeleteBrandDialog({
  brandToDelete,
  setBrandToDelete,
  isDeletingBrand,
  submitDeleteBrand,
}: DeleteBrandDialogProps) {
  return (
    <Dialog open={!!brandToDelete} onOpenChange={(open) => !open && setBrandToDelete(null)}>
      <DialogContent className="max-w-[400px] rounded-md border-border shadow-lg bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Brand ကို ဖျက်မှာ သေချာပါသလား?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။ Brand နှင့် သက်ဆိုင်သော အချက်အလက်များ အားလုံး ပျက်သွားပါမည်။
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setBrandToDelete(null)}
            disabled={isDeletingBrand}
            className="flex-1 sm:flex-none rounded-sm border-border"
          >
            မဖျက်တော့ပါ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async (e) => {
              e.preventDefault();
              await submitDeleteBrand();
              setBrandToDelete(null);
            }}
            disabled={isDeletingBrand}
            className="flex-1 sm:flex-none rounded-sm bg-red-600 hover:bg-red-700"
          >
            {isDeletingBrand ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ဖျက်နေပါသည်...
              </>
            ) : (
              "ဖျက်မည်"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
