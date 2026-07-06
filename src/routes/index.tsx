import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, DollarSign, ShoppingCart, TrendingUp, Sparkles, Film, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { useReferencias, useMetricas, useAprendizados } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Video Factory" }] }),
  component: Dashboard,
});

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);
const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const FUNIL = [
  { key: "mapeado", label: "Mapeado" },
  { key: "analisado", label: "Analisado" },
  { key: "kit_pronto", label: "Kit pronto" },
  { key: "produzido", label: "Produzido" },
  { key: "publicado", label: "Publicado" },
  { key: "concluido", label: "Concluído" },
];

function Dashboard() {
  const { data: referencias = [], isLoading: l1 } = useReferencias();
  const { data: metricas = [], isLoading: l2 } = useMetricas();
  const { data: aprendizados = [], isLoading: l3 } = useAprendizados();

  if (l1 || l2 || l3) {
    return (
      <PageShell title="Dashboard" description="Carregando dados...">
        <div className="h-96 grid place-items-center text-muted-foreground animate-pulse">
          Sincronizando métricas...
        </div>
      </PageShell>
    );
  }

  const totals = metricas.reduce(
    (a, m: any) => ({
      views: a.views + (m.views || 0),
      vendas: a.vendas + (m.vendas || 0),
      receita: a.receita + Number(m.receita || 0),
    }),
    { views: 0, vendas: 0, receita: 0 },
  );
  const custoEstim = referencias.length * 45;
  const lucro = totals.receita - custoEstim;
  const vendasPor1k = totals.views > 0 ? (totals.vendas / totals.views) * 1000 : 0;

  const funil = FUNIL.map((f) => ({
    ...f,
    count: referencias.filter((r: any) => r.status === f.key).length,
  }));

  const top5 = [...metricas]
    .map((m: any) => ({
      ...m,
      v1k: m.views > 0 ? (m.vendas / m.views) * 1000 : 0,
    }))
    .sort((a, b) => b.v1k - a.v1k)
    .slice(0, 5);

  const repetir = aprendizados.filter((a: any) => (a.peso ?? 0) > 0).slice(0, 5);
  const evitar = aprendizados.filter((a: any) => (a.peso ?? 0) < 0).slice(0, 5);

  return (
    <PageShell
      title="Dashboard"
      description="Visão da fábrica — o que funciona, o que evitar, e o que está em produção."
      actions={
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/referencias">
            <Sparkles className="h-4 w-4" /> Nova referência
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Receita" value={brl(totals.receita)} icon={DollarSign} tone="success" />
        <MetricCard label="Vendas" value={fmt(totals.vendas)} icon={ShoppingCart} tone="brand" />
        <MetricCard label="Views" value={fmt(totals.views)} icon={Eye} />
        <MetricCard label="Lucro estimado" value={brl(lucro)} icon={TrendingUp} tone="success" />
        <MetricCard label="Vendas / 1k views" value={vendasPor1k.toFixed(2)} icon={Sparkles} tone="info" />
      </div>

      <Card className="bg-card/70 mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Film className="h-4 w-4 text-primary" /> Funil de produção
          </CardTitle>
          <CardDescription>Quantidade de referências em cada etapa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {funil.map((f) => (
              <div key={f.key} className="rounded-lg border border-border bg-background/40 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                <div className="font-display text-2xl font-bold mt-1">{f.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-card/70 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> Repetir
            </CardTitle>
            <CardDescription>Padrões que estão convertendo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {repetir.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem aprendizados positivos registrados.</div>
            )}
            {repetir.map((a: any) => (
              <div key={a.id} className="rounded-md border border-success/20 bg-success/5 px-3 py-2 text-xs">
                <Badge variant="outline" className="border-success/40 text-success mr-2">{a.categoria}</Badge>
                {a.titulo}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Evitar
            </CardTitle>
            <CardDescription>Padrões com baixo retorno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {evitar.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem aprendizados negativos registrados.</div>
            )}
            {evitar.map((a: any) => (
              <div key={a.id} className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2 text-xs">
                <Badge variant="outline" className="border-warning/40 text-warning mr-2">{a.categoria}</Badge>
                {a.titulo}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top 5 criativos</CardTitle>
            <CardDescription>Vendas por 1.000 views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {top5.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem métricas.</div>
            )}
            {top5.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium">{m.criativo?.titulo || "Sem título"}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {m.criativo?.produto?.nome || "—"}
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">{m.v1k.toFixed(2)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
