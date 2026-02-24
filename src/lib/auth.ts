// src/lib/auth.ts
export const getSession = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  return token && userId ? { token, userId } : null;
};