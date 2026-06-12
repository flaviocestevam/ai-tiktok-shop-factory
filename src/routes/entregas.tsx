import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClientes } from "@/integrations/supabase/hooks";

import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/entregas")({
  head: () => ({ meta: [{ title: "Entregas — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  const { data: clientes, isLoading } = useClientes();

  if (isLoading) {
    return (
      <PageShell title="Entregas" description="Carregando entregas...">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }


  return (
    <PageShell title="Entregas" description="Pacote completo por cliente — vídeos, carrosséis, links, custo, lucro, margem e relatório.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clientes?.map((c) => {

          const vContratados = c.videos_contratados || 0;
          const cContratados = c.carrosseis_contratados || 0;
          const total = vContratados + cContratados;
          const pend = 0; // Simplified for now
          const valor = c.valor_contrato || 0;
          const custo = c.custo_estimado || 0;
          const lucro = valor - custo;
          const margem = valor > 0 ? ((lucro / valor) * 100).toFixed(1) : "0";

          return (
            <Card key={c.id} className="bg-card/70">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{c.empresa}</CardTitle>
                  <Badge className={pend === 0 ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}>
                    {pend === 0 ? "completo" : `${pend} pendente(s)`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Mini k="Vídeos" v={String(vContratados)} />
                  <Mini k="Carrosséis" v={String(cContratados)} />
                  <Mini k="Total criativos" v={String(total)} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Mini k="Custo" v={brl(custo)} tone="warning" />
                  <Mini k="Lucro" v={brl(lucro)} tone="success" />

                  <Mini k="Margem" v={`${margem}%`} tone="success" />
                </div>
                <div className="rounded-md border border-border bg-card p-2 text-xs text-muted-foreground">
                  Data prevista: 30/06 · Observações: revisão final concluída
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" />Pacote ZIP</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Relatório</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function Mini({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="rounded-md border border-border bg-card px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`text-sm font-semibold ${c}`}>{v}</div>
    </div>
  );
}
