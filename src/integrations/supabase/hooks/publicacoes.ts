import { supabase } from "../client";
import { unwrap, useQuery } from "./_helpers";

export const usePublicacoes = () =>
  useQuery({
    queryKey: ["publicacoes"],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("publicacoes")
          .select("*, criativo:criativos(titulo, tipo), perfil:perfis(nome)")
          .order("publicado_em", { ascending: false, nullsFirst: false }),
        [],
      ),
  });

export const useMetricas = () =>
  useQuery({
    queryKey: ["metricas"],
    queryFn: async () => {
      const rows = unwrap<any[]>(
        await supabase
          .from("metricas")
          .select(
            "*, publicacao:publicacoes(id, tiktok_url, criativo:criativos(id, titulo, perfil_id, avatar_id, produto_id, tipo, gancho, produto:produtos(nome)))",
          ),
        [],
      );
      return rows.map((m) => ({
        ...m,
        criativo: m.publicacao?.criativo ?? null,
        criativo_id: m.publicacao?.criativo?.id ?? null,
      }));
    },
  });
