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
      
      // For now, return empty metrics if real aggregate query fails complex syntax
      return data.map(p => ({
        ...p,
        receita: 0,
        vendas: 0,
        custo_producao: 0
      }));
    },
  });
};

export const usePerfil = (id: string) => {
  return useQuery({
    queryKey: ["perfis", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select(`
          *,
          produtos_ativos:produtos(count),
          campanhas_vinculadas:campanhas(count)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      
      return {
        ...data,
        metricas: {
          views: 0,
          vendas: 0,
          receita: 0,
          custoProducao: 0,
          lucro: 0,
          roi: 0,
          ctr: 0,
          cvr: 0,
          vendasPor1k: 0,
          receitaPor1k: 0,
          custoPorVenda: 0,
          custoPorCriativo: 0,
          melhorProduto: "—",
          piorProduto: "—",
          melhorFormato: "—",
          piorFormato: "—",
          melhorAvatar: "—",
          melhorGancho: "—",
          melhorTipo: "—"
        },
        recomendacoes: {
          repetir: [],
          evitar: []
        }
      };
    },
    enabled: !!id,
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

export const useProduto = (id: string) => {
  return useQuery({
    queryKey: ["produtos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select(`
          *,
          perfil:perfis(nome),
          cliente:clientes(empresa)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
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
      
      return data.map(c => ({
        ...c,
        receita: 0,
        custo_real: 0
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

export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ["clientes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};


export const useCriativos = () => {
  return useQuery({
    queryKey: ["criativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criativos")
        .select(`
          *,
          produto:produtos(nome),
          campanha:campanhas(nome),
          avatar:avatares(nome)

        `);
      if (error) throw error;
      return data;
    },
  });
};

export const useAutomacoes = () => {
  return useQuery({
    queryKey: ["automacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automacoes")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useAprendizados = () => {
  return useQuery({
    queryKey: ["aprendizados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aprendizados")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useMetricas = () => {
  return useQuery({
    queryKey: ["metricas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metricas")
        .select(`
          *,
          criativo:criativos(titulo, perfil_id, produto:produtos(nome))
        `);
      if (error) throw error;
      return data;
    },
  });
};



