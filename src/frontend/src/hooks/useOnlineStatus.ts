import { useCallback, useEffect, useState } from "react";

export type OnlineStatus = "online" | "offline" | "reconnecting";

/**
 * Tracks browser connectivity and exposes a status plus a manual retry.
 * `reconnecting` is reported for a short window after a reconnect event so
 * the UI can show a "reconnecting" state before settling back to online.
 */
export function useOnlineStatus(): {
  status: OnlineStatus;
  isOnline: boolean;
  retry: () => void;
} {
  const [isOnline, setIsOnline] = useState<boolean>(
    () => typeof navigator === "undefined" || navigator.onLine,
  );
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnecting(true);
      const timer = window.setTimeout(() => setReconnecting(false), 1200);
      return () => window.clearTimeout(timer);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setReconnecting(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const retry = useCallback(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    setReconnecting(false);
  }, []);

  const status: OnlineStatus = !isOnline
    ? "offline"
    : reconnecting
      ? "reconnecting"
      : "online";

  return { status, isOnline, retry };
}
