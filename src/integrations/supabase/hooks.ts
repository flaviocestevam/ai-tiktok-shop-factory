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
          conectores:conectores_api(*)
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
          campanhas_vinculadas:campanhas(count),
          conectores:conectores_api(*)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      
      const { data: metricas } = await supabase
        .from("metricas")
        .select(`
          *,
          publicacao:publicacoes(
            criativo:criativos(perfil_id)
          )
        `);

      const profileMetricas = (metricas as any[])?.filter(m => m.publicacao?.criativo?.perfil_id === id) || [];
      const views = profileMetricas.reduce((s, m) => s + (m.views || 0), 0);
      const vendas = profileMetricas.reduce((s, m) => s + (m.vendas || 0), 0);
      const receita = profileMetricas.reduce((s, m) => s + (m.receita || 0), 0);
      const custo = (data as any).campanhas_vinculadas?.[0]?.count * 150 || 0; // Mock cost

      return {
        ...data,
        metricas: {
          views,
          vendas,
          receita,
          custoProducao: custo,
          lucro: receita - custo,
          roi: receita / Math.max(custo, 1),
          ctr: 0.05,
          cvr: (vendas / Math.max(views, 1)) * 100,
          vendasPor1k: (vendas / Math.max(views, 1)) * 1000,
          receitaPor1k: (receita / Math.max(views, 1)) * 1000,
          custoPorVenda: custo / Math.max(vendas, 1),
          custoPorCriativo: custo / Math.max((data as any).campanhas_vinculadas?.[0]?.count || 1, 1),
          melhorProduto: "Método Viral Pro",
          piorProduto: "—",
          melhorFormato: "9:16",
          piorFormato: "—",
          melhorAvatar: "Digital",
          melhorGancho: "Curiosidade",
          melhorTipo: "Vídeo"
        },
        recomendacoes: {
          repetir: ["Ganchos de curiosidade", "Formato tutorial"],
          evitar: ["Legendas genéricas"]
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
          publicacao:publicacoes(
            id,
            criativo:criativos(
              id,
              titulo,
              perfil_id,
              produto:produtos(nome)
            )
          )
        `);
      if (error) throw error;
      
      return (data as any[]).map(m => ({
        ...m,
        criativo: m.publicacao?.criativo || null,
        criativo_id: m.publicacao?.criativo?.id || null
      }));
    },
  });
};



