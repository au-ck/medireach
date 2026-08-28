import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useOnlineStatus", () => ({
  useOnlineStatus: vi.fn(),
}));

const useOnlineStatusMock = vi.mocked(useOnlineStatus);

function renderIndicator() {
  return render(
    <LanguageProvider>
      <OfflineIndicator />
    </LanguageProvider>,
  );
}

describe("OfflineIndicator connectivity states", () => {
  beforeEach(() => {
    useOnlineStatusMock.mockReset();
  });

  it("shows the online state when connected", () => {
    useOnlineStatusMock.mockReturnValue({
      status: "online",
      isOnline: true,
      retry: vi.fn(),
    });
    renderIndicator();
    expect(screen.getByTestId("status.online")).toBeInTheDocument();
  });

  it("shows the reconnecting state during a reconnect window", () => {
    useOnlineStatusMock.mockReturnValue({
      status: "reconnecting",
      isOnline: true,
      retry: vi.fn(),
    });
    renderIndicator();
    expect(screen.getByTestId("status.reconnecting")).toBeInTheDocument();
  });

  it("shows the offline state with a retry action when disconnected", async () => {
    const retry = vi.fn();
    useOnlineStatusMock.mockReturnValue({
      status: "offline",
      isOnline: false,
      retry,
    });
    const user = userEvent.setup();
    renderIndicator();

    expect(screen.getByTestId("status.offline")).toBeInTheDocument();
    await user.click(screen.getByTestId("status.retry_button"));
    expect(retry).toHaveBeenCalled();
  });
});
