import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { supabase } from "../client";

/** Lança se houver erro do Supabase; senão devolve `data` (ou fallback). */
export function unwrap<T>(res: { data: T | null; error: unknown }, fallback?: T): T {
  if (res.error) throw res.error;
  return (res.data ?? (fallback as T)) as T;
}

type TableName = Parameters<typeof supabase.from>[0];

/** Hook de listagem simples: SELECT * FROM <table> [ORDER BY column]. */
export function createListHook<T = any>(
  key: string,
  table: TableName,
  opts: { select?: string; orderBy?: string; ascending?: boolean } = {},
) {
  const { select = "*", orderBy, ascending = true } = opts;
  return function useList(queryOpts?: Omit<UseQueryOptions<T[]>, "queryKey" | "queryFn">) {
    return useQuery<T[]>({
      queryKey: [key],
      queryFn: async () => {
        let q = supabase.from(table).select(select) as any;
        if (orderBy) q = q.order(orderBy, { ascending });
        return unwrap<T[]>(await q, [] as T[]);
      },
      ...queryOpts,
    });
  };
}

/** Hook de leitura por id. */
export function createByIdHook<T = any>(
  key: string,
  table: TableName,
  opts: { select?: string } = {},
) {
  const { select = "*" } = opts;
  return function useById(id: string | undefined | null) {
    return useQuery<T>({
      queryKey: [key, id],
      queryFn: async () =>
        unwrap<T>(await supabase.from(table).select(select).eq("id", id!).single() as any),
      enabled: !!id,
    });
  };
}

/** Invalida uma ou mais queryKeys. */
export function useInvalidator(keys: string[]) {
  const qc = useQueryClient();
  return (extra?: Array<readonly unknown[]>) => {
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    extra?.forEach((k) => qc.invalidateQueries({ queryKey: k }));
  };
}

export { useMutation, useQuery, useQueryClient };
