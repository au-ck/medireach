import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useTranslation } from "@/i18n/useTranslation";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { status, retry } = useOnlineStatus();
  const { t } = useTranslation();

  if (status === "online") {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
        data-ocid="status.online"
      >
        <Wifi className="size-3.5" aria-hidden="true" />
        <span>{t("common.online")}</span>
      </div>
    );
  }

  if (status === "reconnecting") {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning"
        data-ocid="status.reconnecting"
      >
        <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
        <span>{t("common.reconnecting")}</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
      data-ocid="status.offline"
    >
      <WifiOff className="size-3.5" aria-hidden="true" />
      <span>{t("common.connectionLost")}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
        onClick={retry}
        data-ocid="status.retry_button"
      >
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}
