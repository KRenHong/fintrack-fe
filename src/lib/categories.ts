import { useEffect } from "react";
import { api, asArray } from "@/lib/api";
import { QueryClient, useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/domain";
import { getAccessToken } from "@/lib/auth";

const KEY = ["categories"] as const;
const STORAGE_KEY = "categories_cache_v1";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories/");
  return asArray<Category>(data);
}

function readFromSession(): Category[] | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Category[]) : undefined;
  } catch {
    return;
  }
}
function writeToSession(data: Category[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useCategories() {
  const enabled = !!getAccessToken();

  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchCategories,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    placeholderData: readFromSession() ?? [],
  });

  useEffect(() => {
    if (Array.isArray(q.data)) writeToSession(q.data);
  }, [q.data]);

  return { ...q, list: Array.isArray(q.data) ? q.data : [] };
}

export async function prefetchCategories(queryClient: QueryClient) {
  return queryClient.prefetchQuery({ queryKey: KEY, queryFn: fetchCategories });
}
