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
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}
export const logout = () => {
  localStorage.removeItem("session");
};
export function clearSession() {
  localStorage.removeItem(KEY);
}