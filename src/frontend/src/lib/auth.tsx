import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Role } from "./types";

const ROLE_STORAGE_KEY = "medireach.role";

interface AuthContextValue {
  role: Role | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
  if (
    stored === "patient" ||
    stored === "pharmacist" ||
    stored === "doctor" ||
    stored === "admin"
  ) {
    return stored;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isInitializing, clear } = useInternetIdentity();
  const [role, setRole] = useState<Role | null>(getStoredRole);

  // In this demo, selecting a role is what authenticates the user. The
  // protected routes gate on `isAuthenticated`, so a chosen role must count
  // as an authenticated session even without a real Internet Identity login.
  const isAuthenticated = role !== null;

  const login = useCallback((nextRole: Role) => {
    setRole(nextRole);
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
    } catch {
      // role still applies for the session
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    try {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    clear();
  }, [clear]);

  const value = useMemo(
    () => ({ role, isAuthenticated, isInitializing, login, logout }),
    [role, isAuthenticated, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
