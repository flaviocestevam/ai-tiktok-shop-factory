import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { publicacoes } from "@/lib/mock/data";
import { conectores } from "@/lib/mock/extra";
import { RefreshCw, Zap, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/publicacoes")({
  head: () => ({ meta: [{ title: "Publicações — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

const statusIcon: Record<string, any> = {
  conectado: CheckCircle2, pendente: Clock, erro: AlertTriangle, desconectado: AlertTriangle,
};
const statusColor: Record<string, string> = {
  conectado: "text-success", pendente: "text-warning", erro: "text-destructive", desconectado: "text-muted-foreground",
};

function atribuicao(p: { vendas: number; views: number }) {
  if (p.vendas >= 100) return { nivel: "Direta", conf: "Alta", tone: "bg-success/15 text-success border-success/30" };
  if (p.views >= 50000) return { nivel: "Produto + janela 48h", conf: "Média", tone: "bg-info/15 text-info border-info/30" };
  return { nivel: "Campanha", conf: "Baixa", tone: "bg-warning/15 text-warning border-warning/30" };
}

function Page() {
  return (
    <PageShell
      title="Publicações"
      description="Fluxo API-first. A coleta atualiza dados sem usar IA. IA só roda sob demanda para interpretar."
      actions={<Button size="sm" className="gap-1.5"><RefreshCw className="h-4 w-4" />Sincronizar agora</Button>}
    >
      <Card className="bg-card/70 border-primary/30 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />Conectores de Dados</CardTitle>
          <CardDescription>Integrações ativas para puxar publicações, métricas, pedidos e comissões.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {conectores.map((c) => {
            const Icon = statusIcon[c.status];
            return (
              <div key={c.id} className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-sm">{c.nome}</div>
                    <div className="text-xs text-muted-foreground capitalize">{c.tipo} • {c.ultimaSync}</div>
                  </div>
                  <Icon className={`h-4 w-4 ${statusColor[c.status]}`} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{c.metricas.join(" • ")}</div>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="capitalize text-[10px]">{c.status}</Badge>
                  <Button size="sm" variant="ghost" className="h-6 text-[11px]">Configurar</Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-card/70">
        <CardHeader className="pb-2"><CardTitle className="text-base">Publicações sincronizadas</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Criativo</th>
                <th className="text-left p-3">Perfil</th>
                <th className="text-right p-3">Data</th>
                <th className="text-right p-3">Views</th>
                <th className="text-right p-3">Cliques</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">V/1k</th>
                <th className="text-left p-3">Atribuição</th>
              </tr>
            </thead>
            <tbody>
              {publicacoes.map((p) => {
                const a = atribuicao(p);
                return (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="p-3 font-medium">{p.criativo}</td>
                    <td className="p-3 text-muted-foreground">{p.perfil}</td>
                    <td className="p-3 text-right">{p.data}</td>
                    <td className="p-3 text-right">{fmt(p.views)}</td>
                    <td className="p-3 text-right">{fmt(p.cliques)}</td>
                    <td className="p-3 text-right">{fmt(p.vendas)}</td>
                    <td className="p-3 text-right text-success">{brl(p.receita)}</td>
                    <td className="p-3 text-right">{(p.vendas / (p.views / 1000)).toFixed(2)}</td>
                    <td className="p-3"><Badge className={a.tone}>{a.nivel} • conf. {a.conf}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
