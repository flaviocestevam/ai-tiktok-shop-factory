import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, DollarSign, ShoppingCart, TrendingUp, Sparkles, Target, Zap, AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { perfis, clientes, produtos, criativos, trend7d } from "@/lib/mock/data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard Geral — Video Factory" }] }),
  component: Dashboard,
});

function fmt(n: number) {
  return new Intl.NumberFormat("pt-BR").format(n);
}
function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function Dashboard() {
  const totals = perfis.reduce(
    (a, p) => ({
      views: a.views + p.metricas.views,
      vendas: a.vendas + p.metricas.vendas,
      receita: a.receita + p.metricas.receita,
      custo: a.custo + p.metricas.custoProducao,
      criativos: a.criativos + p.metricas.criativos,
    }),
    { views: 0, vendas: 0, receita: 0, custo: 0, criativos: 0 },
  );
  const lucro = totals.receita - totals.custo;
  const roi = totals.receita / Math.max(totals.custo, 1);
  const cpv = totals.custo / Math.max(totals.vendas, 1);

  const perfilBars = perfis.map((p) => ({
    nome: p.nome,
    receita: p.metricas.receita,
    custo: p.metricas.custoProducao,
  }));

  return (
    <PageShell
      title="Dashboard Geral"
      description="Visão consolidada de todos os perfis próprios e clientes — foco no que vende mais com menor custo."
      actions={
        <>
          <Button variant="outline" size="sm">Exportar</Button>
          <Button size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" /> Nova campanha</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard label="Views" value={fmt(totals.views)} delta={12} icon={Eye} hint="vs período anterior" />
        <MetricCard label="Vendas" value={fmt(totals.vendas)} delta={18} icon={ShoppingCart} tone="brand" />
        <MetricCard label="Receita" value={brl(totals.receita)} delta={22} icon={DollarSign} tone="success" />
        <MetricCard label="Custo produção" value={brl(totals.custo)} delta={-6} icon={Zap} tone="warning" hint="-6% por criativo" />
        <MetricCard label="Lucro estimado" value={brl(lucro)} delta={24} icon={TrendingUp} tone="success" />
        <MetricCard label="ROI" value={`${roi.toFixed(1)}x`} delta={9} icon={Target} tone="info" hint={`Custo/venda ${brl(cpv)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance — últimos 7 dias</CardTitle>
            <CardDescription>Views, vendas e custo agregados em milhares.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={trend7d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="vendas" stroke="var(--color-chart-3)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Receita × Custo por perfil</CardTitle>
            <CardDescription>Compara margem entre perfis próprios.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={perfilBars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="receita" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="custo" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> O que repetir
            </CardTitle>
            <CardDescription>Padrões com maior venda por 1.000 views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {perfis.flatMap((p) => p.recomendacoes.repetir.map((r) => ({ p: p.nome, r }))).slice(0, 6).map((x, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-success/20 bg-success/5 px-3 py-2">
                <Badge variant="outline" className="border-success/40 text-success">{x.p}</Badge>
                <span className="text-foreground/90">{x.r}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> O que evitar
            </CardTitle>
            <CardDescription>Padrões com views altas e poucas vendas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {perfis.flatMap((p) => p.recomendacoes.evitar.map((r) => ({ p: p.nome, r }))).slice(0, 6).map((x, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 px-3 py-2">
                <Badge variant="outline" className="border-warning/40 text-warning">{x.p}</Badge>
                <span className="text-foreground/90">{x.r}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top criativos publicados</CardTitle>
            <CardDescription>Maior venda por 1.000 views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {criativos.filter((c) => c.status === "publicado").map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.produto} • {c.avatar}</div>
                </div>
                <Badge variant="secondary" className="shrink-0">{c.vendas} vendas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Meus Perfis</CardTitle>
              <CardDescription>Performance consolidada.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost"><Link to="/perfis">Ver todos</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {perfis.map((p) => (
              <Link key={p.id} to="/perfis/$id" params={{ id: p.id }}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:border-primary/40 transition">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.nome}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.nicho} • {p.metricas.criativos} criativos</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right"><div className="text-muted-foreground">ROI</div><div className="font-display font-semibold">{p.metricas.roi.toFixed(1)}x</div></div>
                  <div className="text-right"><div className="text-muted-foreground">Vendas/1k</div><div className="font-display font-semibold">{p.metricas.vendasPor1k.toFixed(2)}</div></div>
                  <div className="text-right"><div className="text-muted-foreground">Receita</div><div className="font-display font-semibold">{brl(p.metricas.receita)}</div></div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Clientes recorrentes</CardTitle>
              <CardDescription>Margem e entregas em andamento.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost"><Link to="/clientes">Ver todos</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {clientes.map((c) => {
              const margem = ((c.valor - c.custoProducao) / c.valor) * 100;
              return (
                <Link key={c.id} to="/clientes/$id" params={{ id: c.id }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:border-primary/40 transition">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.empresa}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.plano} • {c.criativosEntregues}/{c.videosContratados + c.carrosseisContratados} entregues</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right"><div className="text-muted-foreground">Margem</div><div className="font-display font-semibold text-success">{margem.toFixed(1)}%</div></div>
                    <div className="text-right"><div className="text-muted-foreground">Lucro</div><div className="font-display font-semibold">{brl(c.valor - c.custoProducao)}</div></div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Produtos em destaque</CardTitle>
            <CardDescription>Maior potencial de venda e menor risco.</CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost"><Link to="/produtos">Ver todos</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {produtos.slice(0, 4).map((p) => (
              <Link key={p.id} to="/produtos/$id" params={{ id: p.id }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition">
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  <img src={p.imagem} alt={p.nome} className="h-full w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{p.nome}</div>
                    <Badge className="bg-primary/15 text-primary border-primary/30">{p.score}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{p.categoria} • {p.classificacao}</div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
