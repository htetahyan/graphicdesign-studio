"use client";

import React from "react";
import Image from "next/image";
import { Loader2, Trash2, ReplaceIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteBrandDialog } from "./DeleteBrandDialog";

interface BrandDialogsProps {
  editingBrand: any;
  closeEditBrand: () => void;
  editName: string;
  setEditName: (name: string) => void;
  editLogo: File | null;
  setEditLogo: (file: File | null) => void;
  isEditing: boolean;
  isDeletingBrand: boolean;
  brandToDelete: any;
  setBrandToDelete: (brand: any) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  submitEditBrand: () => Promise<void>;
  submitDeleteBrand: () => Promise<void>;
}

export function BrandDialogs({
  editingBrand,
  closeEditBrand,
  editName,
  setEditName,
  editLogo,
  setEditLogo,
  isEditing,
  isDeletingBrand,
  brandToDelete,
  setBrandToDelete,
  logoInputRef,
  submitEditBrand,
  submitDeleteBrand,
}: BrandDialogsProps) {
  return (
    <>
      <DeleteBrandDialog
        brandToDelete={brandToDelete}
        setBrandToDelete={setBrandToDelete}
        isDeletingBrand={isDeletingBrand}
        submitDeleteBrand={submitDeleteBrand}
      />

      <Dialog open={!!editingBrand} onOpenChange={(open) => !open && closeEditBrand()}>
        <DialogContent className="rounded-md border-border shadow-lg bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">brand ပြင်ဆင်ရန်</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              brand အမည်၊ logo ပြောင်းလဲနိုင်ပါသည်။
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                brand name
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Brand name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                logo
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setEditLogo(e.target.files?.[0] ?? null)}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md border border-border bg-secondary overflow-hidden flex items-center justify-center">
                  {editLogo ? (
                    <img
                      src={URL.createObjectURL(editLogo)}
                      alt="New logo preview"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : editingBrand?.logo_url ? (
                    <Image
                      src={editingBrand.logo_url}
                      alt="Current logo"
                      width={100}
                      height={100}
                      className="h-full w-full object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground">No logo</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isEditing || isDeletingBrand}
                      className="rounded-sm h-9 border-border"
                    >
                      <ReplaceIcon className="w-3.5 h-3.5 mr-1.5" />
                      Replace
                    </Button>

                    {editLogo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditLogo(null)}
                        disabled={isEditing || isDeletingBrand}
                        className="rounded-sm h-9 text-muted-foreground"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBrandToDelete(editingBrand)}
                disabled={isEditing || isDeletingBrand}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditBrand}
                  disabled={isDeletingBrand || isEditing}
                  className="rounded-sm h-10 border-border"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="accent"
                  onClick={submitEditBrand}
                  disabled={isEditing || isDeletingBrand}
                  className="rounded-sm h-10 px-6 bg-primary text-primary-foreground hover:opacity-90"
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
