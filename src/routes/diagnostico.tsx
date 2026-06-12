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
        {casosDiagnostico.map((c) => {
          const Icon = c.status === "Escalar" ? CheckCircle2 : c.status === "Pausar" ? AlertTriangle : c.status === "Corrigir CTA" || c.status === "Corrigir gancho" ? RefreshCw : Activity;
          return (
            <Card key={c.id} className={`bg-card/70 ${c.status === "Escalar" ? "border-success/40" : c.status === "Pausar" ? "border-destructive/40" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardDescription>Caso</CardDescription>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />{c.titulo}
                    </CardTitle>
                  </div>
                  <Badge className={statusColor[c.status]}>{c.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Stat k="Views" v={fmt(c.views)} />
                  <Stat k="Cliques" v={fmt(c.cliques)} />
                  <Stat k="Vendas" v={fmt(c.vendas)} />
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Diagnóstico</div>
                  <div>{c.diagnostico}</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-primary mb-1">Ação</div>
                  <div>{c.acao}</div>
                </div>
                <div className="text-xs text-muted-foreground">Exemplo de criativo: "{c.exemploCriativo}"</div>
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
