import { useQuery } from "@tanstack/react-query";
import { supabase } from "./client";

export const usePerfis = () => {
  return useQuery({
    queryKey: ["perfis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select(`
          *,
          produtos_ativos:produtos(count),
          campanhas_vinculadas:campanhas(count)
        `);
      if (error) throw error;
      return data;
    },
  });
};

export const useProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCampanhas = () => {
  return useQuery({
    queryKey: ["campanhas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campanhas")
        .select(`
          *,
          produto:produtos(nome),
          perfil:perfis(nome),
          cliente:clientes(empresa)
        `);
      if (error) throw error;
      return data;
    },
  });
};

export const useGeminiAccounts = () => {
  return useQuery({
    queryKey: ["gemini_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gemini_accounts")
        .select("*")
        .order("prioridade", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCustos = () => {
  return useQuery({
    queryKey: ["custos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custos")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};
