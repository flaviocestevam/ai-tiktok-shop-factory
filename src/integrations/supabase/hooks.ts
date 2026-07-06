import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./client";

// ============ Perfis ============
export const usePerfis = () => {
  return useQuery({
    queryKey: ["perfis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select("*, conectores:conectores_api(*)")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const usePerfil = (id: string) => {
  return useQuery({
    queryKey: ["perfis", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select("*, conectores:conectores_api(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// ============ Produtos ============
export const useProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("produtos").select("*").order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useProduto = (id: string) => {
  return useQuery({
    queryKey: ["produtos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*, perfil:perfis(nome)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// ============ Avatares ============
export const useAvatares = () => {
  return useQuery({
    queryKey: ["avatares"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avatares")
        .select("*, fotos:avatar_fotos(*)")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useAvatar = (id: string) => {
  return useQuery({
    queryKey: ["avatares", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avatares")
        .select("*, fotos:avatar_fotos(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// ============ Vídeos de Referência ============
export const useReferencias = () => {
  return useQuery({
    queryKey: ["videos_referencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos_referencia")
        .select("*, produto:produtos(nome), perfil:perfis(nome), avatar:avatares(nome)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useReferencia = (id: string) => {
  return useQuery({
    queryKey: ["videos_referencia", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos_referencia")
        .select("*, produto:produtos(id, nome), perfil:perfis(id, nome), avatar:avatares(id, nome)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateReferencia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      url_tiktok: string;
      produto_id?: string | null;
      perfil_id?: string | null;
      avatar_id?: string | null;
      tipo_criativo?: "video" | "carrossel";
    }) => {
      const { data, error } = await supabase
        .from("videos_referencia")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos_referencia"] }),
  });
};

export const useUpdateReferencia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Record<string, any>) => {
      const { data, error } = await supabase
        .from("videos_referencia")
        .update(patch as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["videos_referencia"] });
      qc.invalidateQueries({ queryKey: ["videos_referencia", v.id] });
    },
  });
};

// ============ Criativos ============
export const useCriativos = () => {
  return useQuery({
    queryKey: ["criativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criativos")
        .select("*, produto:produtos(nome), avatar:avatares(nome), referencia:videos_referencia(url_tiktok)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

// ============ Publicações & Métricas ============
export const usePublicacoes = () => {
  return useQuery({
    queryKey: ["publicacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicacoes")
        .select("*, criativo:criativos(titulo, tipo), perfil:perfis(nome)")
        .order("publicado_em", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useMetricas = () => {
  return useQuery({
    queryKey: ["metricas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metricas")
        .select("*, publicacao:publicacoes(id, tiktok_url, criativo:criativos(id, titulo, perfil_id, avatar_id, produto_id, tipo, gancho, produto:produtos(nome)))");
      if (error) throw error;
      return (data ?? []).map((m: any) => ({
        ...m,
        criativo: m.publicacao?.criativo ?? null,
        criativo_id: m.publicacao?.criativo?.id ?? null,
      }));
    },
  });
};

// ============ Custos ============
export const useCustos = () => {
  return useQuery({
    queryKey: ["custos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("custos").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// ============ Aprendizados ============
export const useAprendizados = () => {
  return useQuery({
    queryKey: ["aprendizados"],
    queryFn: async () => {
      const { data, error } = await supabase.from("aprendizados").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// ============ Automações ============
export const useAutomacoes = () => {
  return useQuery({
    queryKey: ["automacoes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("automacoes").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// ============ Gemini ============
export const useGeminiAccounts = () => {
  return useQuery({
    queryKey: ["gemini_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gemini_accounts")
        .select("*")
        .order("prioridade", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
};
