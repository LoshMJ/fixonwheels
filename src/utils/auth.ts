// src/utils/auth.ts

export type UserRole = "customer" | "technician" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthSession = {
  token: string;
  role: UserRole;
  user: AuthUser;
};

const KEY = "fixonwheels_session";

export function setSession(session: AuthSession) {
  // ✅ keep your old storage (backward compatible)
  localStorage.setItem(KEY, JSON.stringify(session));

  // ✅ ALSO store keys used by AdminRoutes / ProtectedRoute
  localStorage.setItem("token", session.token);
  localStorage.setItem("user", JSON.stringify(session.user));
}

export function getSession(): AuthSession | null {
  // ✅ prefer the new unified session key
  const raw = localStorage.getItem(KEY);

  if (raw) {
    try {
      const s = JSON.parse(raw) as AuthSession;

      // ✅ ensure token/user keys exist for guards (auto repair)
      if (s?.token) localStorage.setItem("token", s.token);
      if (s?.user) localStorage.setItem("user", JSON.stringify(s.user));

      return s;
    } catch {
      // fallthrough to legacy reading below
    }
  }

  // ✅ fallback: if only token/user exist, rebuild session object
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as AuthUser;
    const session: AuthSession = { token, role: user.role, user };

    // ✅ restore main KEY too
    localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}
export const logout = () => {
  localStorage.removeItem("session");
};
export function clearSession() {
  // ✅ clear everything
  localStorage.removeItem(KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}