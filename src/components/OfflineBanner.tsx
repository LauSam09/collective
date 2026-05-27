import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === "undefined") {
      return true;
    }

    return navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-16 z-40 border-b border-red-300/50 bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm"
    >
      <div className="mx-auto flex max-w-screen-2xl items-center gap-2">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        <span>No internet connection. Some features may be unavailable.</span>
      </div>
    </div>
  );
};
