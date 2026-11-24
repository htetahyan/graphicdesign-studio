import { useEffect, useState } from "react";

export function useNetworkStatus(showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast("အင်တာနက် ပြန်လည်ချိတ်ဆက်မိပါပြီ", "success");
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast("အင်တာနက် ချိတ်ဆက်မှုပြတ်တောက်နေပါသည်", "error");
    };

    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  return isOffline;
}
