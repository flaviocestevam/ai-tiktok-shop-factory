import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/metric-card";
import {
  useMetricas, useAprendizados, useAvatares, useReferencias, useProdutos, usePerfis,
} from "@/integrations/supabase/hooks";
import { Brain, TrendingUp, AlertTriangle, Trophy } from "lucide-react";

export const Route = createFileRoute("/inteligencia")({
  head: () => ({ meta: [{ title: "Inteligência — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

type Rank = { key: string; label: string; vendas: number; views: number; receita: number; v1k: number };

function rankBy(
  metricas: any[],
  key: (m: any) => string | null | undefined,
  labelMap?: Map<string, string>,
): Rank[] {
  const map = new Map<string, Rank>();
  for (const m of metricas) {
    const k = key(m);
    if (!k) continue;
    const label = labelMap?.get(k) ?? k;
    const cur = map.get(k) ?? { key: k, label, vendas: 0, views: 0, receita: 0, v1k: 0 };
    cur.vendas += m.vendas || 0;
    cur.views += m.views || 0;
    cur.receita += Number(m.receita || 0);
    map.set(k, cur);
  }
  return [...map.values()]
    .map((r) => ({ ...r, v1k: r.views > 0 ? (r.vendas / r.views) * 1000 : 0 }))
    .sort((a, b) => b.v1k - a.v1k);
}

function Page() {
  const { data: metricas = [], isLoading: l1 } = useMetricas();
  const { data: aprendizados = [], isLoading: l2 } = useAprendizados();
  const { data: avatares = [] } = useAvatares();
  const { data: produtos = [] } = useProdutos();
  const { data: perfis = [] } = usePerfis();
  const { data: referencias = [] } = useReferencias();

  if (l1 || l2) {
    return (
      <PageShell title="Inteligência" description="Carregando aprendizados...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const avatarLabel = new Map(avatares.map((a: any) => [a.id, a.nome]));
  const produtoLabel = new Map(produtos.map((p: any) => [p.id, p.nome]));
  const perfilLabel = new Map(perfis.map((p: any) => [p.id, p.nome]));

  const rAvatares = rankBy(metricas, (m) => m.criativo?.avatar_id, avatarLabel);
  const rProdutos = rankBy(metricas, (m) => m.criativo?.produto_id, produtoLabel);
  const rPerfis = rankBy(metricas, (m) => m.criativo?.perfil_id, perfilLabel);
  const rGanchos = rankBy(metricas, (m) => m.criativo?.gancho);
  const rFormatos = rankBy(metricas, (m) => m.criativo?.tipo);

  const totals = metricas.reduce(
    (a, m: any) => ({
      views: a.views + (m.views || 0),
      vendas: a.vendas + (m.vendas || 0),
      receita: a.receita + Number(m.receita || 0),
    }),
    { views: 0, vendas: 0, receita: 0 },
  );
  const custo = referencias.length * 45;
  const lucro = totals.receita - custo;
  const cps = totals.vendas > 0 ? custo / totals.vendas : 0;

  const repetir = aprendizados.filter((a: any) => (a.peso ?? 0) > 0);
  const evitar = aprendizados.filter((a: any) => (a.peso ?? 0) < 0);

  return (
    <PageShell
      title="Inteligência da Fábrica"
      description="Métricas que ensinam o que converte. Rankings ordenados por vendas por 1.000 views."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Receita" value={brl(totals.receita)} icon={TrendingUp} tone="success" />
        <MetricCard label="Vendas" value={fmt(totals.vendas)} tone="brand" />
        <MetricCard label="Lucro" value={brl(lucro)} tone="success" />
        <MetricCard label="Custo/venda" value={brl(cps)} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <RankCard title="Melhores avatares" ranks={rAvatares} />
        <RankCard title="Melhores produtos" ranks={rProdutos} />
        <RankCard title="Melhores perfis" ranks={rPerfis} />
        <RankCard title="Melhores formatos" ranks={rFormatos} />
        <RankCard title="Melhores ganchos" ranks={rGanchos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-success" /> Repetir
            </CardTitle>
            <CardDescription>Aprendizados positivos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {repetir.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum aprendizado positivo ainda.</p>
            )}
            {repetir.map((a: any) => (
              <div key={a.id} className="rounded-md border border-success/20 bg-success/5 px-3 py-2 text-sm">
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
            <CardDescription>Aprendizados negativos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {evitar.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum aprendizado negativo ainda.</p>
            )}
            {evitar.map((a: any) => (
              <div key={a.id} className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2 text-sm">
                <Badge variant="outline" className="border-warning/40 text-warning mr-2">{a.categoria}</Badge>
                {a.titulo}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function RankCard({ title, ranks }: { title: string; ranks: Rank[] }) {
  return (
    <Card className="bg-card/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {ranks.length === 0 && (
          <p className="text-xs text-muted-foreground">Sem dados suficientes.</p>
        )}
        {ranks.slice(0, 5).map((r, i) => (
          <div
            key={r.key}
            className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <span className="truncate">{r.label}</span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
              <span>V/1k <b className="text-foreground">{r.v1k.toFixed(2)}</b></span>
              <span>{brl(r.receita)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
