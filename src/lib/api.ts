import axios from "axios";
import { getAccessToken, refreshTokens } from "@/lib/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      const ok = await refreshTokens();
      if (ok) return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
