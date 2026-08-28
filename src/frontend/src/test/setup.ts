import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Generated components use `data-ocid` as their test hook attribute.
configure({ testIdAttribute: "data-ocid" });

// Radix UI (used by the Select, Dialog, Tabs primitives) calls pointer-capture
// methods that jsdom does not implement. Polyfill them so pointer events do not
// throw inside the component.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

// jsdom does not implement scrollIntoView, which Radix Select calls when it
// opens its listbox.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// The AuthProvider consumes useInternetIdentity() from @caffeineai/core-infrastructure.
// We mock the whole module so tests can control the identity session without a
// real Internet Identity flow. The mock exposes a mutable state object that
// tests can flip to simulate an authenticated / unauthenticated session.
const identityState = {
  isAuthenticated: false,
  isInitializing: false,
};

vi.mock("@caffeineai/core-infrastructure", () => {
  return {
    InternetIdentityProvider: ({ children }: { children: React.ReactNode }) =>
      children,
    useInternetIdentity: () => ({
      isAuthenticated: identityState.isAuthenticated,
      isInitializing: identityState.isInitializing,
      clear: vi.fn(),
    }),
  };
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  identityState.isAuthenticated = false;
  identityState.isInitializing = false;
  vi.restoreAllMocks();
});

export { identityState };
