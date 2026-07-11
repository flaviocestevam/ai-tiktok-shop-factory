import { supabase } from "../client";
import { createListHook, useInvalidator, useMutation } from "./_helpers";

const KEY = "geracoes_video";
const TABLE = "geracoes_video" as const;

export const useGeracoes = (referenciaId?: string | null) => {
  const list = createListHook(KEY + ":" + (referenciaId ?? "none"), TABLE, {
    orderBy: "created_at",
    ascending: false,
  });
  return list({ enabled: !!referenciaId } as any);
};

export const useGeracoesByReferencia = (referenciaId?: string | null) => {
  const invalidate = useInvalidator([KEY]);
  return {
    invalidate,
    query: async () => {
      if (!referenciaId) return [];
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("referencia_id", referenciaId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  };
};
