import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicacoes, useMetricas } from "@/integrations/supabase/hooks";
import { RefreshCw, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/publicacoes")({
  head: () => ({ meta: [{ title: "Publicações — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function Page() {
  const { data: publicacoes = [], isLoading: l1 } = usePublicacoes();
  const { data: metricas = [], isLoading: l2 } = useMetricas();

  if (l1 || l2) {
    return (
      <PageShell title="Publicações" description="Carregando...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const metricasPorPub = new Map<string, any>();
  for (const m of metricas as any[]) {
    if (m.publicacao_id) metricasPorPub.set(m.publicacao_id, m);
  }

  return (
    <PageShell
      title="Publicações"
      description="Vídeos e carrosséis publicados. Métricas via API ou entrada manual."
      actions={
        <Button size="sm" className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Sincronizar
        </Button>
      }
    >
      <Card className="bg-card/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Publicações sincronizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Criativo</th>
                <th className="text-left p-3">Perfil</th>
                <th className="text-right p-3">Views</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">V/1k</th>
                <th className="text-left p-3">Origem</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {publicacoes.map((p: any) => {
                const m = metricasPorPub.get(p.id);
                const v1k = m?.views > 0 ? ((m?.vendas ?? 0) / m.views) * 1000 : 0;
                return (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="p-3 font-medium">{p.criativo?.titulo || "—"}</td>
                    <td className="p-3 text-muted-foreground">{p.perfil?.nome || "—"}</td>
                    <td className="p-3 text-right">{fmt(m?.views ?? 0)}</td>
                    <td className="p-3 text-right">{fmt(m?.vendas ?? 0)}</td>
                    <td className="p-3 text-right text-success">{brl(Number(m?.receita ?? 0))}</td>
                    <td className="p-3 text-right">{v1k.toFixed(2)}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {m?.origem || "—"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {p.tiktok_url && (
                        <a
                          href={p.tiktok_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                        >
                          Abrir <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
              {publicacoes.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Nenhuma publicação sincronizada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
