import { useState, useCallback } from "react";
import { VALIDATION_LIMITS, type FormValidationErrors } from "@/components/generate/schema";

interface UseImageUploadsProps {
  showToast: (msg: string, type: "success" | "error" | "info" | "warning", duration?: number) => void;
  clearFieldError: (field: keyof FormValidationErrors) => void;
}

export function useImageUploads({ showToast, clearFieldError }: UseImageUploadsProps) {
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);
  const [characterImages, setCharacterImages] = useState<File[]>([]);
  const [characterImagePreviews, setCharacterImagePreviews] = useState<string[]>([]);

  const handleReferenceImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      const totalFiles = referenceImages.length + newFiles.length;

      if (totalFiles > VALIDATION_LIMITS.MAX_REFERENCE_IMAGES) {
        showToast(`Reference ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_REFERENCE_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`, "error");
        return;
      }

      // Validate file size and type
      for (const file of newFiles) {
        if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
          showToast(`"${file.name}" ဖိုင်အရွယ်အစား ကြီးလွန်းပါသည် (Max ${VALIDATION_LIMITS.MAX_IMAGE_SIZE_MB}MB)`, "error");
          return;
        }
        if (!(VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
          showToast(`"${file.name}" ဖိုင်အမျိုးအစား မမှန်ပါ။ JPEG, PNG, WebP, GIF သုံးပါ`, "error");
          return;
        }
      }

      clearFieldError("referenceImages");
      setReferenceImages((prev) => [...prev, ...newFiles]);

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReferenceImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      showToast(
        `ပုံ ${newFiles.length} ပုံ ထည့်ပြီးပါပြီ`,
        "success"
      );
    },
    [referenceImages.length, showToast, clearFieldError]
  );

  const handleCharacterImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newFiles = Array.from(files);
      const remainingSlots = Math.max(0, VALIDATION_LIMITS.MAX_CHARACTER_IMAGES - characterImages.length);
      const accepted = newFiles.slice(0, remainingSlots);

      if (accepted.length === 0) {
        showToast(`Subject ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_CHARACTER_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`, "error");
        return;
      }

      for (const file of accepted) {
        if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
          showToast(`"${file.name}" ဖိုင်အရွယ်အစား ကြီးလွန်းပါသည် (Max ${VALIDATION_LIMITS.MAX_IMAGE_SIZE_MB}MB)`, "error");
          return;
        }
        if (!(VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
          showToast(`"${file.name}" ဖိုင်အမျိုးအစား မမှန်ပါ။ JPEG, PNG, WebP, GIF သုံးပါ`, "error");
          return;
        }
      }

      clearFieldError("characterImages");
      setCharacterImages((prev) => [...prev, ...accepted]);

      accepted.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCharacterImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      showToast(
        `Subject ပုံ ${accepted.length} ပုံ ထည့်ပြီးပါပြီ`,
        "success"
      );
    },
    [characterImages.length, showToast, clearFieldError]
  );

  const removeCharacterImage = useCallback(
    (index: number) => {
      setCharacterImages((prev) => prev.filter((_, i) => i !== index));
      setCharacterImagePreviews((prev) => prev.filter((_, i) => i !== index));
      showToast("Subject ပုံ ဖယ်ရှားပြီးပါပြီ", "success");
    },
    [showToast]
  );

  const removeReferenceImage = useCallback(
    (index: number) => {
      setReferenceImages((prev) => prev.filter((_, i) => i !== index));
      setReferenceImagePreviews((prev) => prev.filter((_, i) => i !== index));
      showToast("Reference ပုံ ဖယ်ရှားပြီးပါပြီ", "success");
    },
    [showToast]
  );

  return {
    referenceImages,
    referenceImagePreviews,
    characterImages,
    characterImagePreviews,
    handleReferenceImageUpload,
    handleCharacterImageUpload,
    removeCharacterImage,
    removeReferenceImage,
  };
}
