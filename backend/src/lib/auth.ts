// src/lib/auth.ts
export const setAuth = (token: string, userId: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
};

export const getSession = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  return token && userId ? { token, userId } : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};