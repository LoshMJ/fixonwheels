// frontend/src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

// If BASE_URL = http://127.0.0.1:5000/api  -> BACKEND_ORIGIN = http://127.0.0.1:5000
export const BACKEND_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

type Session = {
  token?: string;
  role?: string;
  user?: { id: string; name: string; email: string; role: string };
};

function getToken() {
  const raw = localStorage.getItem("fixonwheels_session");
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    return s?.token || null;
  } catch {
    return null;
  }
}

//  Fix images saved like "/uploads/xxx.jpg"
export function resolveImgUrl(img: string) {
  if (!img) return "https://via.placeholder.com/600x400?text=No+Image";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/uploads/")) return `${BACKEND_ORIGIN}${img}`;
  return img;
}

export async function api<T = any>(path: string, options: RequestInit = {}) {
  const token = getToken();

  //  If body is FormData, DO NOT set Content-Type.
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = new Headers(options.headers || {});
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  const data =
    contentType.includes("application/json")
      ? (text ? JSON.parse(text) : null)
      : text;

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? `Request failed: ${res.status} (Non-JSON response)`
        : (data as any)?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}