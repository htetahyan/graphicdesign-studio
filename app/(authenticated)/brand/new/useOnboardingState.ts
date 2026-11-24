"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/context/ui-context";
import { useCustomBackButton } from "@/hooks/useBackButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createBrand } from "@/app/actions/brand";
import { fetchInspirationTemplates } from "@/app/actions/inspirations";
import type { InspirationTemplate } from "./templates";
import type { BrandFormValues } from "./types";
import { brandSchema } from "./types";
import { useOnboardingFiles } from "./useOnboardingFiles";
import { submitBrand } from "./submitBrandHelper";
import { useProgressTimer } from "./useProgressTimer";

const TEMPLATE_PAGE_SIZE = 6;

export function useOnboardingState(initialTemplates: InspirationTemplate[] = []) {
  const router = useRouter();
  const { showToast } = useUI();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBrandId, setCreatedBrandId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const progressValue = useProgressTimer(isPending);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [designSource, setDesignSource] = useState<"my_brand" | "inspiration">("my_brand");
  
  const [inspirationTemplates, setInspirationTemplates] = useState<InspirationTemplate[]>(initialTemplates);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(initialTemplates.length === 6);

  // Initial fetch on mount - load all templates
  useEffect(() => {
    if (initialTemplates.length > 0) return;

    setInspirationTemplates([]);
    setHasMoreTemplates(true);
    setIsLoadingTemplates(true);
    fetchInspirationTemplates({ 
      limit: TEMPLATE_PAGE_SIZE,
      offset: 0
    })
      .then(templates => {
        setInspirationTemplates(templates);
        setHasMoreTemplates(templates.length === TEMPLATE_PAGE_SIZE);
      })
      .catch(console.error)
      .finally(() => setIsLoadingTemplates(false));
  }, [initialTemplates]);
  

  // Hardware back button: go to previous wizard step, or exit to /generate on step 1
  const handleHardwareBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.push("/generate");
    }
  }, [currentStep, router]);
  useCustomBackButton(handleHardwareBack);
  

  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      images: [],
      referenceImages: [],
      logo: null,
      designSource: "my_brand",
      description: "",
      preferredCtas: "",
      brandVoice: "",
      industry: "",
      inspirationTemplateIds: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    setValue("logo", logo, { shouldValidate: true });
  }, [logo, setValue]);

  useEffect(() => {
    setValue("images", images, { shouldValidate: true });
  }, [images, setValue]);

  useEffect(() => {
    setValue("referenceImages", referenceImages, { shouldValidate: true });
  }, [referenceImages, setValue]);

  const watchedImages = images;
  const watchedReferenceImages = referenceImages;
  const watchedLogo = logo;
  const watchedName = watch("name");
  const watchedInspirationTemplateIds = watch("inspirationTemplateIds") || [];

  const fileHandlers = useOnboardingFiles({
    logo,
    setLogo,
    images,
    setImages,
    referenceImages,
    setReferenceImages,
  });

  const onSubmitTo = (redirectTo: "generate" | "gallery") =>
    handleSubmit(async (data: BrandFormValues) => {
      setServerError(null);
      startTransition(async () => {
        await submitBrand({
          data,
          designSource,
          selectedIndustry,
          showToast,
          router,
          setCreatedBrandId,
          setIsSuccess,
          setServerError,
          redirectTo,
        });
      });
    });

  return {
    currentStep,
    setCurrentStep,
    serverError,
    setServerError,
    selectedIndustry,
    setSelectedIndustry,
    designSource,
    setDesignSource,
    ...fileHandlers,
    inspirationTemplates,
    isLoadingTemplates,
    register,
    handleSubmit,
    onSubmitTo,
    setValue,
    watch,
    errors,
    watchedImages,
    watchedReferenceImages,
    watchedLogo,
    watchedName,
    watchedInspirationTemplateIds,
    isSuccess,
    createdBrandId,
    isPending,
    progressValue,
  };
}
