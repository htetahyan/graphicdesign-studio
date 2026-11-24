import React, { useState } from "react";
import { Plus } from "lucide-react";

interface BrandLogoSectionProps {
  watchedLogo: File | null;
  currentLogoUrl: string | null;
  onLogoChange: (file: File | null) => void;
}

export function BrandLogoSection({
  watchedLogo,
  currentLogoUrl,
  onLogoChange,
}: BrandLogoSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent, dragging: boolean) => {
    e.preventDefault();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (file) onLogoChange(file);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        brand လိုဂို
      </label>
      <div className="flex items-center gap-4">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          className={`relative h-24 w-24 rounded-2xl border-2 border-dashed ${isDragging ? "border-primary bg-secondary" : "border-border bg-card"} hover:bg-secondary flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group`}
        >
          <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
          {watchedLogo ? (
            <>
              <img src={URL.createObjectURL(watchedLogo)} alt="New Logo" className="absolute inset-0 w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onLogoChange(null);
                }}
                className="absolute bg-secondary/90 text-foreground border border-border p-1 rounded-full top-1 right-1 opacity-0 group-hover:opacity-100"
              >
                <Plus className="w-3 h-3 rotate-45" />
              </button>
            </>
          ) : currentLogoUrl ? (
            <>
              <img src={currentLogoUrl} alt="Current Logo" className="absolute inset-0 w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-[10px] font-bold text-foreground bg-secondary/90 border border-border px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  Change
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-secondary border border-border shadow-sm flex items-center justify-center mb-1">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Upload
              </span>
            </>
          )}
        </label>
        <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
          logo အသစ် ပြောင်းလဲရန် ပုံတစ်ပုံကို ရွေးပါ
        </p>
      </div>
    </div>
  );
}
