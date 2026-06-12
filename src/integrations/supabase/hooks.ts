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
          campanhas_vinculadas:campanhas(count),
          receita:publicacoes(metricas(receita.sum())),
          vendas:publicacoes(metricas(vendas.sum())),
          custo_total:custos(total_cost.sum())
        `);
      if (error) throw error;
      
      return data.map(p => ({
        ...p,
        receita: p.publicacoes?.reduce((sum, pub) => sum + (pub.metricas?.[0]?.sum || 0), 0) || 0,
        vendas: p.publicacoes?.reduce((sum, pub) => sum + (pub.metricas?.[0]?.sum || 0), 0) || 0,
        custo_producao: p.custos?.reduce((sum, c) => sum + (c.sum || 0), 0) || 0
      }));
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
          cliente:clientes(empresa),
          receita:criativos(publicacoes(metricas(receita.sum()))),
          custo:custos(total_cost.sum())
        `);
      if (error) throw error;
      
      return data.map(c => ({
        ...c,
        receita: c.criativos?.reduce((sum, cr) => 
          sum + (cr.publicacoes?.reduce((pSum, pub) => pSum + (pub.metricas?.[0]?.sum || 0), 0) || 0), 0) || 0,
        custo_real: c.custos?.reduce((sum, cust) => sum + (cust.sum || 0), 0) || 0
      }));
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

