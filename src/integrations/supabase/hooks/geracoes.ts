import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../client";

const KEY = "geracoes_video";
const TABLE = "geracoes_video" as const;

export const useGeracoesByReferencia = (referenciaId?: string | null) => {
  return useQuery({
    queryKey: [KEY, referenciaId],
    enabled: !!referenciaId,
    refetchInterval: (q) => {
      const rows = (q.state.data as any[]) ?? [];
      const active = rows.some((r) => ["queued", "running"].includes(r.status));
      return active ? 5000 : false;
    },
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("referencia_id", referenciaId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useInvalidateGeracoes = () => {
  const qc = useQueryClient();
  return (referenciaId?: string | null) =>
    qc.invalidateQueries({ queryKey: [KEY, referenciaId] });
};
