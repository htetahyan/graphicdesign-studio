"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { updateBrand, deleteBrand } from "@/app/actions/brand";
import { FloatingInput } from "@/components/ui/floating-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUI } from "@/components/context/ui-context";
import { BrandLogoSection } from "./components/BrandLogoSection";
import { DeleteBrandZone } from "./components/DeleteBrandZone";

const brandSchema = z.object({
  name: z.string().min(2, "brand name သည် အနည်းဆုံး 2 အက္ခရာ ရှိရပါသည်"),
  logo: z.any().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface EditBrandPageProps {
  brand: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export function EditBrandForm({ brand }: EditBrandPageProps) {
  const router = useRouter();
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.name,
      logo: null,
    },
    mode: "onChange",
  });

  const watchedLogo = watch("logo");

  const onSubmit = async (data: BrandFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.logo) formData.append("logo", data.logo);

        const result = await updateBrand(brand.id, formData);
        if (result.success) {
          showToast("Brand updated successfully", "success");
          router.push("/gallery");
        }
      } catch (e: any) {
        console.error("Update error:", e);
        setServerError(e.message || "Failed to update brand");
        showToast(e.message || "Failed to update brand", "error");
      }
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBrand(brand.id);
      if (result.success) {
        showToast("Brand deleted successfully", "success");
        router.push("/gallery");
      }
    } catch (e: any) {
      console.error("Delete error:", e);
      showToast(e.message || "Failed to delete brand", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center px-4 bg-background/85 backdrop-blur-md border-b border-border">
        <Link href="/gallery" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-semibold text-lg text-foreground">
          brand ပြင်ဆင်ရန်
        </h1>
        <div className="w-10" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-8 pb-32 max-w-2xl mx-auto w-full">
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{serverError}</div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              brand အသေးစိတ်
            </label>
            <div>
              <FloatingInput
                {...register("name")}
                label="brand အမည်"
                placeholder=" "
                className={`bg-secondary border-border text-foreground ${errors.name ? "border-red-400 focus:border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 font-medium ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <BrandLogoSection
            watchedLogo={watchedLogo}
            currentLogoUrl={brand.logo_url}
            onLogoChange={(file) => setValue("logo", file, { shouldValidate: true, shouldDirty: true })}
          />

          <DeleteBrandZone
            showConfirm={showDeleteConfirm}
            setShowConfirm={setShowDeleteConfirm}
            isDeleting={isDeleting}
            onDelete={handleDelete}
          />
        </main>

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/85 backdrop-blur-md border-t border-border pb-safe">
          <div className="max-w-2xl mx-auto w-full">
            <Button
              type="submit"
              disabled={isPending || !isValid || !isDirty}
              className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  သိမ်းဆည်းနေပါသည်...
                </>
              ) : (
                "save မယ်"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

