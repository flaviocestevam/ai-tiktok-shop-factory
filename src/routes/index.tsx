import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, ShoppingCart, TrendingUp, Sparkles, Film, CheckCircle2, AlertTriangle,
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
        <Button asChild size="sm" className="gap-1.5 shadow-[var(--shadow-elegant)]">
          <Link to="/referencias" search={{ new: 1 }}>
            <Sparkles className="h-4 w-4" /> Nova referência
          </Link>
        </Button>
      }
    >
      {/* Bento grid — 12 col */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 stagger-children">
        {/* Row 1 — hero metric + secondary metrics */}
        <div className="col-span-2 md:col-span-4 lg:col-span-6 premium-card relative overflow-hidden rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Receita acumulada</div>
            <div className="mt-3 font-display text-5xl md:text-6xl font-semibold tracking-tight tabular-nums text-gradient-brand">
              {brl(totals.receita)}
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Lucro estimado</div>
                <div className="font-display text-xl font-semibold tabular-nums text-success mt-0.5">{brl(lucro)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Vendas / 1k views</div>
                <div className="font-display text-xl font-semibold tabular-nums mt-0.5">{vendasPor1k.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Custo estimado</div>
                <div className="font-display text-xl font-semibold tabular-nums text-muted-foreground mt-0.5">{brl(custoEstim)}</div>
              </div>
            </div>
          </div>
        </div>

        <MetricCard className="col-span-1 md:col-span-2 lg:col-span-3" label="Vendas" value={fmt(totals.vendas)} icon={ShoppingCart} tone="brand" />
        <MetricCard className="col-span-1 md:col-span-2 lg:col-span-3" label="Views" value={fmt(totals.views)} icon={Eye} tone="info" />

        {/* Funil — full width */}
        <div className="col-span-2 md:col-span-4 lg:col-span-12 premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-base font-semibold">Funil de produção</div>
              <div className="text-xs text-muted-foreground">Quantidade de referências em cada etapa.</div>
            </div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {funil.map((f, i) => (
              <div key={f.key} className="group relative rounded-xl border border-border/60 bg-background/40 p-4 text-center transition-all duration-500 hover:border-primary/40 hover:bg-background/70">
                <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{f.label}</div>
                <div className="font-display text-3xl font-bold mt-2 tabular-nums">{f.count}</div>
                <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mt-1 text-[9px] text-muted-foreground/60 tabular-nums">{i + 1}/{FUNIL.length}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Repetir */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <div className="font-display text-base font-semibold">Repetir</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">Padrões que estão convertendo.</div>
          <div className="space-y-2">
            {repetir.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem aprendizados positivos.</div>
            )}
            {repetir.map((a: any) => (
              <div key={a.id} className="rounded-lg border border-success/15 bg-success/5 px-3 py-2 text-xs transition-colors hover:border-success/30">
                <Badge variant="outline" className="border-success/40 text-success mr-2 text-[10px]">{a.categoria}</Badge>
                {a.titulo}
              </div>
            ))}
          </div>
        </div>

        {/* Evitar */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <div className="font-display text-base font-semibold">Evitar</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">Padrões com baixo retorno.</div>
          <div className="space-y-2">
            {evitar.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem aprendizados negativos.</div>
            )}
            {evitar.map((a: any) => (
              <div key={a.id} className="rounded-lg border border-warning/15 bg-warning/5 px-3 py-2 text-xs transition-colors hover:border-warning/30">
                <Badge variant="outline" className="border-warning/40 text-warning mr-2 text-[10px]">{a.categoria}</Badge>
                {a.titulo}
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div className="font-display text-base font-semibold">Top 5 criativos</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">Vendas por 1.000 views.</div>
          <div className="space-y-2">
            {top5.length === 0 && (
              <div className="text-xs text-muted-foreground">Ainda sem métricas.</div>
            )}
            {top5.map((m: any, i: number) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2 transition-all hover:border-primary/30 hover:bg-background/70">
                <div className="text-[10px] font-display font-bold text-muted-foreground/60 tabular-nums w-4">{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{m.criativo?.titulo || "Sem título"}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {m.criativo?.produto?.nome || "—"}
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 tabular-nums bg-primary/10 text-primary border-primary/20">{m.v1k.toFixed(2)}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
