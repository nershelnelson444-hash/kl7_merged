import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { authService, type LoginInput } from "@/services/auth.service";
import type { AuthUser } from "@/types";

const USER_KEY = "kl7_auth_user";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(input);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}