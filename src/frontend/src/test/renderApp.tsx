import App from "@/App";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Renders the full application (router + providers) with a fresh QueryClient
 * per call so React Query cache does not leak between tests. The
 * InternetIdentityProvider is mocked in the test setup.
 */
export function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>,
  );

  return { ...utils, queryClient };
}

/** Renders a single component wrapped in the language provider. */
export function renderWithLanguage(ui: ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
