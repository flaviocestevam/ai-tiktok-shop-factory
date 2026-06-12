import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMetricas } from "@/integrations/supabase/hooks";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({ meta: [{ title: "Diagnóstico de Conversão — Video Factory" }] }),
  component: Page,
});

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);
const statusColor: Record<string, string> = {
  "Escalar": "bg-success/15 text-success border-success/30",
  "Corrigir CTA": "bg-warning/15 text-warning border-warning/30",
  "Corrigir gancho": "bg-warning/15 text-warning border-warning/30",
  "Trocar produto": "bg-destructive/15 text-destructive border-destructive/30",
  "Trocar oferta": "bg-destructive/15 text-destructive border-destructive/30",
  "Trocar avatar": "bg-info/15 text-info border-info/30",
  "Trocar formato": "bg-info/15 text-info border-info/30",
  "Pausar": "bg-destructive/15 text-destructive border-destructive/30",
};

function getDiagnosis(views: number, cliques: number, vendas: number) {
  const ctr = views > 0 ? (cliques / views) * 100 : 0;
  const cvr = cliques > 0 ? (vendas / cliques) * 100 : 0;

  if (vendas > 10 && cvr > 5) return { status: "Escalar", diag: "Alta conversão e bom volume. Produto campeão.", acao: "Produzir mais variações e aumentar orçamento se houver tráfego pago." };
  if (views > 1000 && ctr < 1) return { status: "Corrigir gancho", diag: "Muitas impressões mas poucos cliques. O início do vídeo não retém.", acao: "Testar ganchos mais agressivos ou curiosidade nos primeiros 3s." };
  if (cliques > 50 && cvr < 0.5) return { status: "Corrigir CTA", diag: "Muitos cliques mas pouca venda. A oferta ou o CTA final estão fracos.", acao: "Melhorar a oferta, adicionar escassez ou trocar o CTA." };
  if (views > 500 && cliques < 5) return { status: "Pausar", diag: "Baixo interesse geral. Nem o gancho nem o produto estão engajando.", acao: "Pausar e avaliar se vale a pena trocar o produto ou o avatar." };
  
  return { status: "Em análise", diag: "Dados insuficientes para um diagnóstico preciso.", acao: "Aguardar mais visualizações e interações." };
}

function Page() {
  const { data: metricas, isLoading } = useMetricas();

  if (isLoading) {
    return (
      <PageShell title="Diagnóstico de Conversão" description="Carregando diagnóstico...">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Diagnóstico de Conversão"
      description="5 cenários típicos, com diagnóstico e ação automática para cada criativo."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {metricas?.map((m) => {
          const diagData = getDiagnosis(m.views || 0, m.cliques || 0, m.vendas || 0);
          const Icon = diagData.status === "Escalar" ? CheckCircle2 : diagData.status === "Pausar" ? AlertTriangle : diagData.status === "Corrigir CTA" || diagData.status === "Corrigir gancho" ? RefreshCw : Activity;
          
          return (
            <Card key={m.id} className={`bg-card/70 ${diagData.status === "Escalar" ? "border-success/40" : diagData.status === "Pausar" ? "border-destructive/40" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardDescription>Criativo: {(m.criativo as any)?.titulo || "—"}</CardDescription>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />{(m.criativo as any)?.produto?.nome || "Sem produto"}
                    </CardTitle>
                  </div>
                  <Badge className={statusColor[diagData.status] || statusColor["Pausar"]}>{diagData.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Stat k="Views" v={fmt(m.views || 0)} />
                  <Stat k="Cliques" v={fmt(m.cliques || 0)} />
                  <Stat k="Vendas" v={fmt(m.vendas || 0)} />
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Diagnóstico</div>
                  <div>{diagData.diag}</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-primary mb-1">Ação</div>
                  <div>{diagData.acao}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
