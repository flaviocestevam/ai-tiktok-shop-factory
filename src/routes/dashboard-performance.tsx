import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMetricas, useCriativos, usePerfis } from "@/integrations/supabase/hooks";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, ShoppingCart, Eye, Zap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard-performance")({
  head: () => ({ meta: [{ title: "Dashboard de Performance — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function Page() {
  const { data: metricas, isLoading: loadingMetricas } = useMetricas();
  const { data: criativos, isLoading: loadingCriativos } = useCriativos();
  const { data: perfis, isLoading: loadingPerfis } = usePerfis();

  if (loadingMetricas || loadingCriativos || loadingPerfis) {
    return (
      <PageShell title="Dashboard de Performance" description="Carregando dados...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const totals = {
    views: metricas?.reduce((s, m) => s + (m.views || 0), 0) || 0,
    vendas: metricas?.reduce((s, m) => s + (m.vendas || 0), 0) || 0,
    receita: metricas?.reduce((s, m) => s + (m.receita || 0), 0) || 0,
    custo: 0, // Placeholder
  };

  const tipoData = [
    { name: "Vídeo", value: criativos?.filter(c => c.tipo === "vídeo").length || 0 },
    { name: "Carrossel", value: criativos?.filter(c => c.tipo === "carrossel").length || 0 },
  ];

  return (
    <PageShell
      title="Dashboard de Performance"
      description="O que vende, o que só dá view, o que dá clique sem venda, o que dá prejuízo."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Views totais" value={fmt(totals.views)} icon={Eye} />
        <MetricCard label="Vendas totais" value={fmt(totals.vendas)} icon={ShoppingCart} tone="brand" />
        <MetricCard label="Receita" value={brl(totals.receita)} icon={DollarSign} tone="success" />
        <MetricCard label="Produzidos" value={fmt(criativos?.length || 0)} icon={Zap} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Distribuição por Perfil</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={perfis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="id" name="Perfil" fill="var(--color-chart-1)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Vídeo × Carrossel — Quantidade</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={tipoData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  <Cell fill="var(--color-chart-1)" />
                  <Cell fill="var(--color-chart-2)" />
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Métricas por Publicação</CardTitle>
          <CardDescription>Acompanhamento real via base de dados.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Criativo</th>
                <th className="text-right p-3">Views</th>
                <th className="text-right p-3">Cliques</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">Receita</th>
              </tr>
            </thead>
            <tbody>
              {metricas?.map((m) => (
                <tr key={m.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3 font-medium">{(m.criativo as any)?.titulo || "—"}</td>
                  <td className="p-3 text-right">{fmt(m.views || 0)}</td>
                  <td className="p-3 text-right">{fmt(m.cliques || 0)}</td>
                  <td className="p-3 text-right">{fmt(m.vendas || 0)}</td>
                  <td className="p-3 text-right text-success">{brl(m.receita || 0)}</td>
                </tr>
              ))}
              {metricas?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhuma métrica coletada ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
