const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const publicApi = {
  products: () => req<any>("/api/products"),
  recent: () => req<any>("/api/recent-items"),
  promos: () => req<any>("/api/promos?active=true"),
};

export const adminApi = {
  createProduct: (body: any) => req("/api/admin/products", { method: "POST", body: JSON.stringify(body) }),
  deleteProduct: (id: string) => req(`/api/admin/products/${id}`, { method: "DELETE" }),

  createRecent: (body: any) => req("/api/admin/recent-items", { method: "POST", body: JSON.stringify(body) }),
  deleteRecent: (id: string) => req(`/api/admin/recent-items/${id}`, { method: "DELETE" }),

  createPromo: (body: any) => req("/api/admin/promos", { method: "POST", body: JSON.stringify(body) }),
  updatePromo: (id: string, body: any) => req(`/api/admin/promos/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePromo: (id: string) => req(`/api/admin/promos/${id}`, { method: "DELETE" }),
};