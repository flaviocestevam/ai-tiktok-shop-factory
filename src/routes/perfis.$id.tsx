import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { perfis, publicacoes, produtos, criativos, avatares } from "@/lib/mock/data";
import {
  Eye, ShoppingCart, DollarSign, Target, TrendingUp, Zap, ChevronLeft,
  CheckCircle2, AlertTriangle, Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
} from "recharts";
import { trend7d } from "@/lib/mock/data";

export const Route = createFileRoute("/perfis/$id")({
  loader: ({ params }) => {
    const perfil = perfis.find((p) => p.id === params.id);
    if (!perfil) throw notFound();
    return { perfil };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.perfil.nome ?? "Perfil"} — Video Factory` }],
  }),
  component: PerfilDetail,
  notFoundComponent: () => (
    <PageShell title="Perfil não encontrado"><p className="text-muted-foreground">Esse perfil não existe.</p></PageShell>
  ),
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function PerfilDetail() {
  const { perfil } = Route.useLoaderData();
  const m = perfil.metricas;
  return (
    <PageShell
      title={perfil.nome}
      description={perfil.descricao}
      actions={
        <>
          <Button asChild variant="ghost" size="sm"><Link to="/perfis"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>
          <Button size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" />Nova campanha</Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <Badge variant="outline">{perfil.nicho}</Badge>
        <Badge variant="outline">{perfil.pais}</Badge>
        <Badge variant="outline">{perfil.plataforma}</Badge>
        <Badge className="bg-success/15 text-success border-success/30">{perfil.status}</Badge>
        <span className="text-muted-foreground">Avatar principal: <strong className="text-foreground">{perfil.avatarPrincipal}</strong></span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="publicacoes">Publicações</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="formatos">Formatos</TabsTrigger>
          <TabsTrigger value="avatares">Avatares</TabsTrigger>
          <TabsTrigger value="ganchos">Ganchos</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <MetricCard label="Views" value={fmt(m.views)} icon={Eye} />
            <MetricCard label="Vendas" value={fmt(m.vendas)} icon={ShoppingCart} tone="brand" />
            <MetricCard label="Receita" value={brl(m.receita)} icon={DollarSign} tone="success" />
            <MetricCard label="Custo produção" value={brl(m.custoProducao)} icon={Zap} tone="warning" />
            <MetricCard label="Lucro" value={brl(m.lucro)} icon={TrendingUp} tone="success" />
            <MetricCard label="ROI" value={`${m.roi.toFixed(1)}x`} icon={Target} tone="info" />
            <MetricCard label="CTR" value={`${m.ctr}%`} hint="cliques / views" />
            <MetricCard label="CVR" value={`${m.cvr}%`} hint="vendas / cliques" />
            <MetricCard label="Vendas / 1k views" value={m.vendasPor1k.toFixed(2)} tone="brand" />
            <MetricCard label="Receita / 1k views" value={brl(m.receitaPor1k)} />
            <MetricCard label="Custo / venda" value={brl(m.custoPorVenda)} tone="warning" />
            <MetricCard label="Custo / criativo" value={brl(m.custoPorCriativo)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 bg-card/70">
              <CardHeader className="pb-2"><CardTitle className="text-base">Tendência 7 dias</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer>
                    <AreaChart data={trend7d}>
                      <defs>
                        <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={11} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                      <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="vendas" stroke="var(--color-chart-1)" fill="url(#pv)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/70">
              <CardHeader className="pb-2"><CardTitle className="text-base">Melhores e piores</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Melhor produto" value={m.melhorProduto} tone="success" />
                <Row label="Pior produto" value={m.piorProduto} tone="warning" />
                <Row label="Melhor formato" value={m.melhorFormato} tone="success" />
                <Row label="Pior formato" value={m.piorFormato} tone="warning" />
                <Row label="Melhor avatar" value={m.melhorAvatar} tone="success" />
                <Row label="Melhor gancho" value={m.melhorGancho} tone="success" />
                <Row label="Melhor tipo" value={m.melhorTipo} tone="brand" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="publicacoes" className="mt-4">
          <Card className="bg-card/70">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr><th className="text-left p-3">Criativo</th><th className="text-right p-3">Data</th><th className="text-right p-3">Views</th><th className="text-right p-3">Cliques</th><th className="text-right p-3">Vendas</th><th className="text-right p-3">Receita</th><th className="text-right p-3">Custo</th></tr>
                </thead>
                <tbody>
                  {publicacoes.filter((p) => p.perfil === perfil.nome).map((p) => (
                    <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                      <td className="p-3 font-medium">{p.criativo}</td>
                      <td className="p-3 text-right text-muted-foreground">{p.data}</td>
                      <td className="p-3 text-right">{fmt(p.views)}</td>
                      <td className="p-3 text-right">{fmt(p.cliques)}</td>
                      <td className="p-3 text-right">{fmt(p.vendas)}</td>
                      <td className="p-3 text-right text-success">{brl(p.receita)}</td>
                      <td className="p-3 text-right text-warning">{brl(p.custo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produtos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {produtos.slice(0, 3).map((p) => (
              <Card key={p.id} className="bg-card/70">
                <CardContent className="p-4 flex gap-3">
                  <img src={p.imagem} alt={p.nome} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium truncate">{p.nome}</div>
                      <Badge className="bg-primary/15 text-primary border-primary/30">{p.score}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{p.categoria}</div>
                    <div className="text-xs mt-1">{p.classificacao}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formatos" className="mt-4">
          <Card className="bg-card/70">
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={[
                    { f: "Carrossel 7img", vendas: 412, custo: 90 },
                    { f: "Vídeo 12s", vendas: 380, custo: 110 },
                    { f: "Vídeo 9s", vendas: 220, custo: 75 },
                    { f: "Carrossel 5img", vendas: 180, custo: 60 },
                    { f: "Vídeo 45s", vendas: 60, custo: 130 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="f" stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="vendas" fill="var(--color-chart-3)" radius={[6,6,0,0]} />
                    <Bar dataKey="custo" fill="var(--color-chart-1)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatares" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {avatares.slice(0, 3).map((a) => (
              <Card key={a.id} className="bg-card/70">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{a.nome}</div>
                    <div className="text-xs text-muted-foreground">{a.nichos.join(" • ")}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div>ROI <strong className="font-display">{a.roi.toFixed(1)}x</strong></div>
                    <div className="text-muted-foreground">CPV {brl(a.custoPorVenda)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ganchos" className="mt-4">
          <Card className="bg-card/70"><CardContent className="p-4 space-y-2 text-sm">
            {["Eu não sabia que precisava disso","Em 7 dias minha pele mudou","Comida nunca mais estragou","Meu cachorro parou de soltar pelo","5 usos que eu não imaginava"].map((g, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                <span>"{g}"</span>
                <Badge variant="secondary">{(0.9 - i*0.12).toFixed(2)} vendas/1k</Badge>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="custos" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Custo total" value={brl(m.custoProducao)} tone="warning" />
            <MetricCard label="Custo/criativo" value={brl(m.custoPorCriativo)} />
            <MetricCard label="Custo/venda" value={brl(m.custoPorVenda)} tone="brand" />
            <MetricCard label="Lucro" value={brl(m.lucro)} tone="success" />
          </div>
        </TabsContent>

        <TabsContent value="recomendacoes" className="mt-4 space-y-3">
          <Card className="bg-card/70">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Repetir</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {perfil.recomendacoes.repetir.map((r: string, i: number) => <div key={i} className="rounded-md border border-success/20 bg-success/5 px-3 py-2">{r}</div>)}
            </CardContent>
          </Card>
          <Card className="bg-card/70">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Evitar</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {perfil.recomendacoes.evitar.map((r: string, i: number) => <div key={i} className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2">{r}</div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostico" className="mt-4">
          <Card className="bg-card/70">
            <CardHeader><CardTitle className="text-base">Diagnóstico de conversão</CardTitle><CardDescription>Por que cada produto vendeu ou não.</CardDescription></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="rounded-md border border-border bg-card px-3 py-2">Vendas/1k acima de 0.6 indica produto saudável — atual: <strong>{m.vendasPor1k.toFixed(2)}</strong></div>
              <div className="rounded-md border border-border bg-card px-3 py-2">CTR x CVR equilibrados — ganho potencial trocando ganchos fracos.</div>
              <div className="rounded-md border border-border bg-card px-3 py-2">Custo/venda alvo: <strong>≤ R$2,00</strong> — atual: <strong>{brl(m.custoPorVenda)}</strong></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "brand" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${cls}`}>{value}</span>
    </div>
  );
}
