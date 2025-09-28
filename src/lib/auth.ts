// src/lib/auth.ts

let access: string | null = localStorage.getItem("access");
let refresh: string | null = localStorage.getItem("refresh");

export const getAccessToken = () => access;

export const setTokens = (a: string, r: string) => {
  access = a;
  refresh = r;
  localStorage.setItem("access", a);
  localStorage.setItem("refresh", r);
};

export const clearTokens = () => {
  access = refresh = null;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export async function refreshTokens(): Promise<boolean> {
  if (!refresh) return false;
  try {
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/auth/jwt/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );
    if (!res.ok) return false;

    const data = await res.json();
    if (data.access) {
      setTokens(data.access, refresh!);
      return true;
    }
  } catch {
    // ignore error
  }
  clearTokens();
  return false;
}
