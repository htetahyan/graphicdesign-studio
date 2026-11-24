 "use client";

import { useEffect, useState } from "react";

type OfflineBannerProps = {
  className?: string;
  message?: string;
};

export function OfflineBanner({
  className = "",
  message = "No Internet Connection — Please check your network.",
}: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let removeNetworkListener: (() => void) | null = null;

    const updateFromNavigator = () => {
      setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    };

    const bindBrowserEvents = () => {
      window.addEventListener("online", updateFromNavigator);
      window.addEventListener("offline", updateFromNavigator);
      updateFromNavigator();
    };

    const bindCapacitorNetwork = async () => {
      try {
        const { Network } = await import("@capacitor/network");
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        const handler = await Network.addListener("networkStatusChange", (s) => {
          setIsOnline(s.connected);
        });
        removeNetworkListener = () => {
          handler.remove();
        };
      } catch {
        // If Capacitor Network plugin isn't available, fallback to browser events.
        bindBrowserEvents();
      }
    };

    if (typeof window !== "undefined") {
      bindCapacitorNetwork();
    }

    return () => {
      window.removeEventListener("online", updateFromNavigator);
      window.removeEventListener("offline", updateFromNavigator);
      if (removeNetworkListener) removeNetworkListener();
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 inset-x-0 z-[200] px-3 py-2 text-center text-xs font-bold text-amber-300 bg-amber-500/15 border-b border-amber-500/25 shadow-sm backdrop-blur-md ${className}`}
    >
      {message}
    </div>
  );
}
