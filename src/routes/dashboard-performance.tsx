import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { perfis, criativos, avatares, totalReceita, totalVendas, totalViews, totalCustoCriativos } from "@/lib/mock/data";
import { formatosVideo, formatosCarrossel, eficienciaComercial } from "@/lib/mock/extra";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, ShoppingCart, Eye, Zap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard-performance")({
  head: () => ({ meta: [{ title: "Dashboard de Performance — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function decisao(ef: number): { label: string; tone: string } {
  if (ef >= 90) return { label: "Escalar", tone: "bg-success/15 text-success border-success/30" };
  if (ef >= 70) return { label: "Manter", tone: "bg-info/15 text-info border-info/30" };
  if (ef >= 50) return { label: "Testar variação", tone: "bg-warning/15 text-warning border-warning/30" };
  return { label: "Pausar", tone: "bg-destructive/15 text-destructive border-destructive/30" };
}

function Page() {
  const totalCriativosPub = criativos.filter(c => c.status === "publicado").length || 1;
  const tabela = [...formatosVideo.slice(0, 6), ...formatosCarrossel.slice(0, 6)].map((f) => {
    const ef = eficienciaComercial(f);
    const publicados = Math.max(1, Math.round(f.vendasPorCriativo / 6));
    const views = publicados * 38000;
    const cliques = Math.round(views * (f.conversaoHistorica / 100) * 4);
    const vendas = publicados * f.vendasPorCriativo;
    const custo = publicados * f.custoMedio;
    return {
      formato: f.nome,
      tipo: (formatosCarrossel as any[]).includes(f) ? "carrossel" : "vídeo",
      publicados, pctCriativos: Math.round(publicados / totalCriativosPub * 100),
      views, cliques, vendas, pctVendas: 0,
      vendasPorCriativo: f.vendasPorCriativo,
      vendasPor1k: +(vendas / (views / 1000)).toFixed(2),
      cliqueParaVenda: +(vendas / cliques * 100).toFixed(1),
      custo, custoPorVenda: +(custo / vendas).toFixed(2), roi: f.roi,
      eficiencia: ef, decisao: decisao(ef),
    };
  });
  const totalVendasTab = tabela.reduce((s, t) => s + t.vendas, 0);
  tabela.forEach(t => t.pctVendas = Math.round(t.vendas / totalVendasTab * 100));
  tabela.sort((a, b) => b.eficiencia - a.eficiencia);

  const perfilData = perfis.map(p => ({
    nome: p.nome, receita: p.metricas.receita,
    custo: p.metricas.custoProducao, lucro: p.metricas.lucro, roi: p.metricas.roi,
  }));

  const viewsVsVendas = criativos.filter(c => c.views && c.vendas).map(c => ({
    nome: c.titulo, views: c.views!, vendas: c.vendas!,
  }));

  const cliquesVsVendas = criativos.filter(c => c.cliques && c.vendas).map(c => ({
    cliques: c.cliques!, vendas: c.vendas!, nome: c.titulo,
  }));

  const tipoData = [
    { name: "Vídeo", value: criativos.filter(c => c.tipo === "vídeo").reduce((s,c)=>s+(c.vendas||0),0) },
    { name: "Carrossel", value: criativos.filter(c => c.tipo === "carrossel").reduce((s,c)=>s+(c.vendas||0),0) },
  ];

  const avatarRank = [...avatares].sort((a, b) => b.roi - a.roi);

  return (
    <PageShell
      title="Dashboard de Performance"
      description="O que vende, o que só dá view, o que dá clique sem venda, o que dá prejuízo."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Views totais" value={fmt(totalViews())} icon={Eye} />
        <MetricCard label="Vendas totais" value={fmt(totalVendas())} icon={ShoppingCart} tone="brand" />
        <MetricCard label="Receita" value={brl(totalReceita())} icon={DollarSign} tone="success" />
        <MetricCard label="Custo produção" value={brl(totalCustoCriativos())} icon={Zap} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Receita × Custo × Lucro por perfil</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={perfilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="receita" fill="var(--color-chart-1)" radius={[6,6,0,0]} />
                <Bar dataKey="custo" fill="var(--color-chart-3)" radius={[6,6,0,0]} />
                <Bar dataKey="lucro" fill="var(--color-chart-2)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">ROI por perfil</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <LineChart data={perfilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="roi" stroke="var(--color-chart-1)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Views × Vendas (detecta view bait)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="views" name="Views" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis dataKey="vendas" name="Vendas" stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Scatter data={viewsVsVendas} fill="var(--color-chart-1)" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Cliques × Vendas (detecta falha de oferta)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="cliques" name="Cliques" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis dataKey="vendas" name="Vendas" stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Scatter data={cliquesVsVendas} fill="var(--color-chart-2)" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Vídeo × Carrossel — vendas</CardTitle></CardHeader>
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

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Performance por avatar</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {avatarRank.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="font-medium">{a.nome}</div>
                  <div className="text-xs text-muted-foreground">{a.nichos.join(" • ")}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline">ROI {a.roi.toFixed(1)}x</Badge>
                  <Badge variant="outline">{a.vendasAtribuidas} vendas</Badge>
                  <Badge variant="outline">R${a.custoPorVenda.toFixed(2)}/venda</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Vendas por formato — eficiência comercial</CardTitle>
          <CardDescription>O formato com mais vendas no total não é necessariamente o melhor. Olhar conversão, vendas por criativo, custo por venda, ROI.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Formato</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-right p-3">Pub.</th>
                <th className="text-right p-3">% cri.</th>
                <th className="text-right p-3">Views</th>
                <th className="text-right p-3">Cliques</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">% vendas</th>
                <th className="text-right p-3">V/cri.</th>
                <th className="text-right p-3">V/1k</th>
                <th className="text-right p-3">CL→V%</th>
                <th className="text-right p-3">Custo</th>
                <th className="text-right p-3">R$/V</th>
                <th className="text-right p-3">ROI</th>
                <th className="text-right p-3">Eficiência</th>
                <th className="text-left p-3">Decisão</th>
              </tr>
            </thead>
            <tbody>
              {tabela.map((r) => (
                <tr key={r.formato} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3 font-medium">{r.formato}</td>
                  <td className="p-3 capitalize text-muted-foreground">{r.tipo}</td>
                  <td className="p-3 text-right">{r.publicados}</td>
                  <td className="p-3 text-right">{r.pctCriativos}%</td>
                  <td className="p-3 text-right">{fmt(r.views)}</td>
                  <td className="p-3 text-right">{fmt(r.cliques)}</td>
                  <td className="p-3 text-right">{fmt(r.vendas)}</td>
                  <td className="p-3 text-right">{r.pctVendas}%</td>
                  <td className="p-3 text-right">{r.vendasPorCriativo}</td>
                  <td className="p-3 text-right">{r.vendasPor1k}</td>
                  <td className="p-3 text-right">{r.cliqueParaVenda}%</td>
                  <td className="p-3 text-right">{brl(r.custo)}</td>
                  <td className="p-3 text-right">R${r.custoPorVenda}</td>
                  <td className="p-3 text-right">{r.roi.toFixed(1)}x</td>
                  <td className="p-3 text-right font-display font-semibold text-primary">{r.eficiencia}</td>
                  <td className="p-3"><Badge className={r.decisao.tone}>{r.decisao.label}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
